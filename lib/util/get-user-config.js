'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var config = require('./../config-default');

var defaultConfigPath = path.resolve(process.cwd(), 'tap.test.conf.js');
var userconfig = "";
function getUserConfig(path) {
	if (userconfig) return userconfig;
	path = path || defaultConfigPath;

	var userConfig;
	try {
		userConfig = require(path);
	} catch (e) {
		return (0, _assign2.default)({}, config);
	}
	userconfig = (0, _assign2.default)({}, config, userConfig.testConfig);
	return userconfig;
}

module.exports = getUserConfig;