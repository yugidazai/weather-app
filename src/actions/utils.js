import { Config } from '../config';
import { API }    from '../core/api';

const api = API(Config.API_URL);

/**
 * Action wraps the method call and specified parameters.
 * May apply any action after getting response from API.
 *
 * @param {function} args.verb
 * - The API method to call to get/update data, e.g. api.get().
 * @param {object} args.params
 * - The params to pass to the method.
 * @param {function} args.callback
 * - A callback that enables you to execute a specific action after execution,
 * e.g. update UI with response data.
 *
 */
const action = ({ type, route, params, callback }) => {
	if (typeof params === 'undefined' || params === null) {
		params = {};
	}

	if (typeof callback === 'undefined' || callback === null) {
		callback = () => {};
	}

	const api_method = api[type](route);
	api_method(params, (err, res) => {
		if (err) {
			callback(err);
		} else {
			callback(null, res);
		}
	});
};

export {
	action
};
