'use strict';

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = require('./index');
var consoleForwardHanlders = require('./console-forward-handlers');

function consoleEventHandler(userConfig, cb) {
  return function () {
    var args = (0, _from2.default)(arguments);
    var type = args[0];
    args = args.slice(1);

    if (type === 'log') {
      consoleForwardHanlders.consoleLogForwardHandler(args);
    } else if (type === 'warn') {
      consoleForwardHanlders.consoleWarnForwardHandler(userConfig, args, function () {
        cb();
      });
    }
  };
}

function pageEventHandler(cb) {
  return function (type, message, stack) {
    /* istanbul ignore if */
    if (type === 'error') {
      util.printRed('  ' + message);
      util.printRed('  ' + stack);
      var err = new Error(message);
      err.stack = stack;

      cb(err);
    }
  };
}

module.exports = {
  consoleEventHandler: consoleEventHandler,
  pageEventHandler: pageEventHandler
};