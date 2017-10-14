'use strict';

function coverageSetup(util, Instrumenter) {
	var originalDefine = define;
	var instrumenter = new Instrumenter();
	/* eslint no-undef:off */
	define = function (_define) {
		function define() {
			return _define.apply(this, arguments);
		}

		define.toString = function () {
			return _define.toString();
		};

		return define;
	}(function () {
		function getFilePath() {
			var ua = typeof window !== 'undefined' && window.navigator && window.navigator.userAgent && window.navigator.userAgent.toLowerCase() || '';

			if (!ua || !/chrome/.test(ua)) {
				console.error('Please run the test index page in chromium browsers. Other browsers are currently not supported.');
				return '';
			}
			var matched = new Error().stack.match(/(at.*)/g);
			var path = matched && matched.length && matched[matched.length - 1];

			return path && path.replace('at ', '').replace(/:\d+:\d+$/, '').replace(/^http:\/\/.*?\//, '');
		}

		var uri, deps, cb;
		var filePath = getFilePath();

		switch (arguments.length) {
			case 1:
				cb = arguments[0];
				break;
			case 2:
				deps = arguments[0];
				cb = arguments[1];
				break;
			case 3:
				uri = arguments[0];
				deps = arguments[1];
				cb = arguments[2];
				break;
			default:
				return;
		}
		// console.log("arguments---"+arguments.length)
		// console.log("==="+arguments[2])
		// console.log("----")

		cb = util.instrumentFunction(cb, instrumenter, filePath) || cb;
		originalDefine.apply(define, uri ? [uri, deps, cb] : [deps, cb]);
	});
}

module.exports = coverageSetup;