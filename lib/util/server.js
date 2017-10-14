'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _journey = require('journey');

var _journey2 = _interopRequireDefault(_journey);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * a barebones HTTP server in JS
 */
var port = 8888,
    http = require('http'),
    urlParser = require('url'),
    fs = require('fs'),
    path = require('path'),

// __dirname 获取的是当前软件的路径，是内置变量；process.cwd()获取的是当前命令行目录
currentDir = process.cwd();

//读取当前软件目录
var MARK_DIR_NAME = "tap-test-lib";

// Create a Router
var router = new _journey2.default.Router();
function mkdirs(dirpath, mode, callback) {
	fs.exists(dirpath, function (exists) {
		if (exists) {
			console.log("exists " + dirpath);
			callback(dirpath);
		} else {
			//尝试创建父目录，然后再创建当前目录
			mkdirs(path.dirname(dirpath), mode, function () {
				console.log("making " + dirpath);
				var di = dirpath.split("/");
				if (di[di.length - 1].indexOf(".") <= 0) {
					fs.mkdir(dirpath, mode, callback);
				} else {
					console.log(dirpath + " is not path");
					callback();
				}
			});
		}
	});
}
function exec(cmdStr, _cb) {
	var exec = require('child_process').exec;
	exec(cmdStr, function (err, stdout, stderr) {
		_cb && _cb();
	});
}
function createPath(_file, cb) {
	if (_file.lastIndexOf("/") != _file.length - 1) {
		var _dir = _file.substring(0, _file.lastIndexOf("/"));
		fs.exists(_dir, function (exists) {
			if (exists) {
				cb();
			} else {
				console.log("dir not exists, create path " + _dir);
				mkdirs(_dir, [777], function (err) {
					if (err) {
						console.log("create path error, path: " + _dir);
					} else {
						cb();
					}
				});
			}
		});
	}
}

function createAndWriteFile(_file, content, needBackup) {
	// cmp文件需要备份
	if (_file.indexOf("cmp") > 0) {
		needBackup = true;
	} else {
		needBackup = false;
	}
	createPath(_file, function () {
		fs.exists(_file, function (exists) {
			if (exists) {
				// serve file
				if (needBackup) {
					console.log(_file + "文件已存在，重命名为" + _file + "_backup");
					exec("mv " + _file + " " + _file + "_backup", function () {
						fs.writeFile(_file, content, function (err) {
							if (err) throw err;
							// console.log('保存成功');
						});
					});
				} else {
					fs.writeFile(_file, content, function (err) {
						if (err) throw err;
						// console.log('保存成功');
					});
				}
			} else {
				fs.writeFile(_file, content, function (err) {
					if (err) throw err;
					// console.log('保存成功');
				});
			}
		});
	});
}
// Create the routing table
router.map(function () {
	this.post(/^generate\/$/).bind(function (req, res, data) {

		createAndWriteFile((0, _path.resolve)(currentDir, data.path), data.content, function () {});
		res.send(200, {}, {
			code: 1,
			message: "写入成功"
		});
	});
});

function exec(cmdStr, _cb) {
	var exec = require('child_process').exec;
	exec(cmdStr, function (err, stdout, stderr) {
		_cb && _cb();
	});
}

function handleRequest(request, response) {
	var urlObject = urlParser.parse(request.url, true);
	var pathname = decodeURIComponent(urlObject.pathname);
	// console.log('[' + (new Date()).toUTCString() + '] ' + '"' + request.method + ' ' + pathname + '"');
	if (/(generate)/g.test(pathname)) {
		var body = "";
		request.addListener('data', function (chunk) {
			body += chunk;
		});
		request.addListener('end', function () {
			// Dispatch the request to the router
			router.handle(request, body, function (result) {
				// response.writeHead(result.status, result.headers);
				response.writeHead(200, {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
					"Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS"
				});
				response.end(result.body);
			});
		});
	} else {
		var filePath = "";
		if (pathname.indexOf(MARK_DIR_NAME) >= 0) {
			var _subPath = pathname.substr(pathname.indexOf(MARK_DIR_NAME) + MARK_DIR_NAME.length);
			//静态文件处理, 限定在lib路径
			filePath = (0, _path.join)(__dirname, "../lib/", _subPath);
		} else {
			//静态文件处理
			filePath = (0, _path.join)(currentDir, pathname);
		}
		// console.log(filePath)
		fs.stat(filePath, function (err, stats) {
			if (err) {
				response.writeHead(404, {});
				response.end('File not found!');
				return;
			}
			if (stats.isFile()) {
				fs.readFile(filePath, function (err, data) {
					if (err) {
						response.writeHead(404, {});
						response.end('Opps. Resource not found');
						return;
					}
					if (filePath.indexOf("svg") > 0) {
						response.writeHead(200, {
							'Content-Type': 'image/svg+xml; charset=utf-8'
						});
					} else {
						response.writeHead(200, {
							"Access-Control-Allow-Origin": "*",
							"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
							"Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS"
						});
					}
					response.write(data);
					response.end();
				});
			} else if (stats.isDirectory()) {
				fs.readdir(filePath, function (error, files) {
					if (error) {
						response.writeHead(500, {});
						response.end();
						return;
					}
					var l = pathname.length;
					if (pathname.substring(l - 1) != '/') pathname += '/';

					response.writeHead(200, {
						'Content-Type': 'text/html'
					});
					response.write('<!DOCTYPE html>\n<html><head><meta charset="UTF-8"><title>' + filePath + '</title></head><body>');
					response.write('<h1>' + filePath + '</h1>');
					response.write('<ul style="list-style:none;font-family:courier new;">');
					files.unshift('.', '..');
					files.forEach(function (item) {
						var urlpath, itemStats;
						if (pathname.indexOf(MARK_DIR_NAME) >= 0) {
							urlpath = pathname.substr(pathname.indexOf(MARK_DIR_NAME) + MARK_DIR_NAME.length) + item;
							itemStats = fs.statSync(__dirname + "\\.." + urlpath);
						} else {
							urlpath = pathname + item;
							itemStats = fs.statSync(currentDir + urlpath);
						}
						if (itemStats.isDirectory()) {
							urlpath += '/';
							item += '/';
						}
						response.write('<li><a href="' + urlpath + '">' + item + '</a></li>');
					});
					response.end('</ul></body></html>');
				});
			}
		});
	}
}
var createServer = function createServer(config, cb) {

	currentDir = config.path || currentDir;
	port = +(config.port || port);
	var server = http.createServer(handleRequest).listen(port);
	require('dns').lookup(require('os').hostname(), function (err, addr, fam) {
		// console.log('server Running at http://127.0.0.1' + ((port == 80) ? '' : (':' + port)) + '/');
	});
	if (config.start == "true") {
		//打开浏览器
		exec("start http://127.0.0.1" + (port == 80 ? '' : ':' + port) + '/cmpApp/static/index.html');
	}
	cb && cb(server);
	return server;
};
exports.default = createServer;
module.exports = exports['default'];