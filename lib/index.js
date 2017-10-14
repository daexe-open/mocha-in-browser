'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var path = require('path');
var Nightmare = require('nightmare');
var getUserConfig = require('./util/get-user-config');
var util = require('./util');
var eventHandlers = require('./util/event-handlers');

// console.log(process.cwd()) //当前命令行目录
// console.log(__dirname) //软件目录
function run(server, type, callback) {

	var userConfig = getUserConfig();
	var defaultConfigPath = path.resolve(process.cwd(), userConfig.configPath);

	var nightmare = Nightmare({
		show: !userConfig.headless
	});
	nightmare.viewport(userConfig[type] && userConfig[type]["width"] || 1024, userConfig[type] && userConfig[type]["height"] || 768);

	console.log('Tests are starting...');
	console.log(__dirname + '/lib/inject.js');
	if (typeof userConfig.addr == "string") {
		var finish = util.finish.bind(null, userConfig.shouldBrowserClosed, nightmare, server, callback);
		var addr = userConfig.addr || "http://localhost:" + userConfig.serverPort;
		nightmare
		// .on('page', eventHandlers.pageEventHandler(finish))
		.on('console', eventHandlers.consoleEventHandler(userConfig, finish)).goto(addr).inject('js', defaultConfigPath) //必须要放到最后一个，因为含有module.export导致注入失败，目前只能导入非AMD/CMD/UMD脚本		
		.inject('js', __dirname + '/lib/inject.js').catch(function (err) {
			// console.log("--- nightmare error --- ")
			util.printRed(util.getErrorOutput(err, '  '));
			// finish(err)
		});
	} else if (Array.isArray(userConfig.addr)) {
		var finish = [];
		var promise = new _promise2.default(function (resolve, reject) {
			resolve([]);
		});
		userConfig.addr.forEach(function (item) {
			var addr = item || "http://localhost:" + userConfig.serverPort;
			promise = promise.then(function () {
				return new _promise2.default(function (resolve, reject) {
					nightmare = Nightmare({
						show: !userConfig.headless
					});
					nightmare.viewport(userConfig[type] && userConfig[type]["width"] || 1024, userConfig[type] && userConfig[type]["height"] || 768)
					// .on('page', eventHandlers.pageEventHandler(finish))
					.on('console', eventHandlers.consoleEventHandler(userConfig, function () {

						resolve();
					})).goto(addr).inject('js', defaultConfigPath) //必须要放到最后一个，因为含有module.export导致注入失败，目前只能导入非AMD/CMD/UMD脚本		
					.inject('js', __dirname + '/lib/inject.js').catch(function (err) {
						// console.log("--- nightmare error --- ")
						util.printRed(util.getErrorOutput(err, '  '));
						// finish(err)
					});
					finish.push(util.finish.bind(null, userConfig.shouldBrowserClosed, nightmare, server, callback));
				});
			});
		});
		promise.then(function (res) {
			finish.forEach(function (fi) {
				fi();
			});
		});
	}
}
exports.default = run;
module.exports = exports['default'];