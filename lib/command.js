#!/usr/bin/env node
"use strict";

var _opts = require("opts");

var _path = require("path");

var _server = require("./util/server.js");

var _server2 = _interopRequireDefault(_server);

var _index = require("./index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getUserConfig = require('./util/get-user-config');
var version = require('../package.json').version;

(0, _opts.parse)([{
	short: "v",
	long: "version",
	description: "Show the version",
	required: false,
	callback: function callback() {
		console.log(version);
		return process.exit(1);
	}
}, {
	short: "t",
	long: "type",
	value: true,
	description: "display type defined in tap.test.conf.js",
	required: false
}, {
	short: "p",
	long: "port",
	description: "Specify the port",
	value: true,
	required: false
}].reverse(), true);

var port = parseInt((0, _opts.get)('port'));
var type = (0, _opts.get)('type');

var configFilePath = (0, _path.resolve)(process.argv[2] || "./tap.test.conf.js");
if (process.argv[2] == "-p") {
	configFilePath = (0, _path.resolve)("./tap.test.conf.js");
}
var userconfig = getUserConfig(configFilePath);

var server = (0, _server2.default)({
	port: port || userconfig.serverPort,
	path: (0, _path.resolve)(userconfig.serverPath)
}, function (ser) {
	(0, _index2.default)(ser, type || userconfig.testType);
});
// console.log("Starting server v" + version + " for " + path + " ......");
// 管理连接
var sockets = [];
server.on("connection", function (socket) {
	sockets.push(socket);
	socket.once("close", function () {
		sockets.splice(sockets.indexOf(socket), 1);
	});
});
//关闭之前，我们需要手动清理连接池中得socket对象
function closeServer() {
	sockets.forEach(function (socket) {
		socket.destroy();
	});
	server.close(function () {
		console.log("close server!");
		process.exit(1);
	});
}
process.on('exit', function () {
	console.log("Welcome back, have a nice day!");
});
process.on('SIGINT', function () {
	closeServer();
	process.exit(1);
});
module.exports = closeServer;