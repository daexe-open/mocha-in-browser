'use strict';

var generateCoverage = require('./generate-coverage');
var config = require('./../config-default');
var util = require('./index');

function consoleLogForwardHandler(args) {
	var content = args.join('');

	if (!/^do|html2canvas|circular|alternately|数据不存在|开发环境/.test(content)) {
		var results = args.map(function (v) {
			return typeof v === 'string' ? v.replace('✓', '\u221A').replace('✖', '\xD7').replace('․', '.') : v && v.toString() || '';
		}).filter(function (v) {
			return !/stdout:/.test(v);
		});

		console.log.apply(console, results);
	}
}

var consoleWarnForwardHandler = function () {
	var doneFlag = false;
	var coverageFlag = false;

	function resetFlags() {
		doneFlag = false;
		coverageFlag = false;
	}

	return function (userConfig, args, cb) {
		var content = args.join('');

		if (new RegExp(config.CONSTANT.MOCHA_DONE_SIGNAL).test(content)) {
			doneFlag = true;
			if (userConfig.coverage && coverageFlag) {
				cb();
				resetFlags();
			} else {
				cb();
				resetFlags();
			}
		} else if (new RegExp(config.CONSTANT.HAS_COVERAGE_SIGNAL).test(content)) {
			coverageFlag = true;
			var cov = "" + args[1];
			if (cov && userConfig.coverage) {

				var coverage = JSON.parse(args[1]);
				generateCoverage(userConfig, coverage, function (err) {
					/* istanbul ignore if */
					if (err) {
						util.printRed(util.getErrorOutput(err, '  '));
						cb(err);
						resetFlags();
						return;
					}
					/* istanbul ignore if */
					if (doneFlag) {
						cb();
						resetFlags();
					}
				});
			} else {
				/* istanbul ignore if */
				if (doneFlag) {
					cb();
					resetFlags();
				}
			}
		}
	};
}();

module.exports = {
	consoleLogForwardHandler: consoleLogForwardHandler,
	consoleWarnForwardHandler: consoleWarnForwardHandler
};