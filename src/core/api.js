import axios from 'axios';
import qs from 'qs';

// ====== API functions ======
const successCallBack = done => response => {
	const { data, status } = response;
	if (data.error != null || data.errors != null) {
		const error = data.error || data.errors[0];
		console.log('API callback error: ', { code: error.code });
		return done(new Error(error.message), { code: error.code });
	} else {
		console.log('API callback success: ', { data, status });
		return done(null, response);
	}
};

const call = (url, route, verb, params = {}) =>
	(done = () => {}) => {
		console.log('call: ', { url, route, verb, params });
		// `params` are the URL parameters to be sent with the request.
		// Must be a plain object or a URLSearchParams object.
		let request = {
			method: verb,
			url: `${url}${route}`,
			params: params,
			paramsSerializer: params => qs.stringify(params),
			crossdomain: true,
			withCredentials: true,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json; charset=utf-8'
			}
		};

		if (verb.toLowerCase() !== `get`) {
			request.data = params;
		}

		axios(request)
			.then(successCallBack(done))
			.catch(error => {
				if (!error.response) return done(error);
				const { response } = error;
				const { status, data } = response;
				if (status !== 200) {
					let finalError;
					if (data) {
						finalError = new Error(data.error? data.error.message : data);
					} else if (data.length === 0) {
						finalError = new Error(`Error calling service ${route}`);
					} else if (typeof data === 'string') {
						finalError = new Error(`Error calling service ${route}: ${data}`.substring(0, 100));
					}
					console.log(finalError.message);
					done(finalError);
				}
			});
	};

// ====== Query Utils ======
const extract_params = function (route) {
	let matches = (route.match(/\{[^}]+}/g)) || [];
	return matches.map(m => m.replace(/[{}]*/g, ''));
};

const api = (url) => {
	let methods = {};
	const generate_method_for = (url, verb) =>
		route =>
			(params, done) => {
				let route_params = extract_params(route);
				let final_route = route;
				for (let param of Array.from(route_params)) {
					final_route = final_route.replace(`{${param}}`, params[param]);
				}
				return call(url, final_route, verb, params)(done);
			};

	for (let verb of ['get', 'post', 'put', 'delete']) {
		methods[verb] = generate_method_for(url, verb);
	}

	return methods;
};

export { api as API };
