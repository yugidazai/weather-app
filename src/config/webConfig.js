const defaultConfig = require('./default.js');
let envConfig = null;
if (process.env.REACT_APP_STAGE && process.env.REACT_APP_STAGE !== 'development') {
	envConfig = require(`./${process.env.REACT_APP_STAGE}.js`);
}

export const Config =
	(!process.env.REACT_APP_STAGE || process.env.REACT_APP_STAGE === 'development')
	? defaultConfig
	: { ...defaultConfig, ...envConfig };
