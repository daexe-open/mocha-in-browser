require('mocha')
window.testUtil = require('./util')
// var Instrumenter = require('./../../node_modules/istanbul/lib/instrumenter')
// require('./../../node_modules/esprima/esprima.js')
// var initCoverage = require('./init-coverage')
// initCoverage(util, Instrumenter);
// window.initCoverage = true

window.expect = require('chai').expect
window.expectExt = require('./init-canvas')

var config = require('./../config-default')
var initMocha = require('./init-mocha')

initMocha(window.mocha, (window.testConfig && window.testConfig.mochaOptions))
function loadScript(url, cb) {
	var script = document.createElement('script');
	script.src = url;
	script.onload = function () {
		cb && cb()
	};

	document.head.appendChild(script);
}

function runMocha() {
	console.log("----------------------------------------")
	console.log("mocha in browser run ...")
	window.mocha.run(function (err) {
		if (err) {
			console.log("---error occur----")
			console.log(err)
		}
		console.log("----------------------------------------")
		console.warn(config.CONSTANT.MOCHA_DONE_SIGNAL)
		console.warn(config.CONSTANT.HAS_COVERAGE_SIGNAL, JSON.stringify(window.__coverage__ || ""))
	})
}
if (window.testConfig && window.testConfig.cookie) {
	window.testConfig.cookie.split("; ").forEach(item => {
		if (!document.cookie.match(item + "=")) {
			document.cookie = item;
		}
	})
}

if (window.testConfig && window.testConfig.injectCases.length) {
	testConfig && testConfig.injectCases.forEach((f, index) => {
		if (index == testConfig.injectCases.length - 1) {
			loadScript(f, runMocha)
		} else {
			loadScript(f)
		}
	})
} else {
	console.warn(config.CONSTANT.MOCHA_DONE_SIGNAL)
	console.warn(config.CONSTANT.HAS_COVERAGE_SIGNAL, JSON.stringify(window.__coverage__ || ""))
}




