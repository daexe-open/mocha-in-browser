'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('mocha');
window.testUtil = require('./util');
// var Instrumenter = require('./../../node_modules/istanbul/lib/instrumenter')
// require('./../../node_modules/esprima/esprima.js')
// var initCoverage = require('./init-coverage')
// initCoverage(util, Instrumenter);
// window.initCoverage = true

window.expect = require('chai').expect;
window.expectExt = require('./init-canvas');

var config = require('./../config-default');
var initMocha = require('./init-mocha');

initMocha(window.mocha, window.userConfig && window.userConfig.mochaOptions);
function loadScript(url, cb) {
	var script = document.createElement('script');
	script.src = url;
	script.onload = function () {
		cb && cb();
	};

	document.head.appendChild(script);
}

function runMocha() {

	// define("mocha/test", window.userConfig && window.userConfig.testFiles, function (require, exports, module) {
	// require(window.userConfig && window.userConfig.testFiles)

	console.log("mocha run ...");
	console.log("----------------------------------------");
	window.mocha.run(function (err) {
		if (err) {
			console.log("---error occur----");
			console.log(err);
		}
		console.warn(config.CONSTANT.MOCHA_DONE_SIGNAL);
		console.warn(config.CONSTANT.HAS_COVERAGE_SIGNAL, (0, _stringify2.default)(window.__coverage__ || ""));
	});
	// })
	// eval("require('mocha/test')")
}
if (window.userConfig.cookie) {
	window.userConfig.cookie.split("; ").forEach(function (item) {
		if (!document.cookie.match(item + "=")) {
			document.cookie = item;
		}
	});
}

if (window.userConfig.injectFiles.length) {
	window.userConfig && window.userConfig.injectFiles.forEach(function (f, index) {
		if (index == window.userConfig.injectFiles.length - 1) {
			loadScript(f, runMocha);
		} else {
			loadScript(f);
		}
	});
} else {
	console.warn(config.CONSTANT.MOCHA_DONE_SIGNAL);
	console.warn(config.CONSTANT.HAS_COVERAGE_SIGNAL, (0, _stringify2.default)(window.__coverage__ || ""));
}