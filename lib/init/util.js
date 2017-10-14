'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var waitForCondition = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(value, ms) {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return checkCond(value, ms);

                    case 2:
                        return _context.abrupt('return');

                    case 3:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function waitForCondition(_x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = require('./../config-default');

var noop = function noop() {
    return true;
};

function getFunctionCode(fnStr) {
    return fnStr.replace(/^function(.|[\r\n])*?\{[\s\r\n]*/, '').replace(/\}$/, '');
}

function getFunctionArgs(fnStr) {
    return fnStr.match(/^function(.|[\r\n])*?\{/)[0].match(/\((.|[\r\n])*\)/)[0].replace(/[()]/g, '').replace(/\/\/.*/g, '').replace(/\/\*(.|[\r\n])*\*\//g, '').replace(/[\s\r\n]/g, '').split(',');
}

function instrumentFunction(fn, instrumenter, filePath) {
    fn = fn || noop;
    var fnStr = fn.toString();

    if (new RegExp(config.CONSTANT.COVERAGE_IDENTIFIER).test(fnStr) && window.userConfig) {
        console.log("---COVERAGE_IDENTIFIER----");
        var fnCode = getFunctionCode(fnStr);
        var fnArgs = getFunctionArgs(fnStr);

        fnCode = instrumenter.instrumentSync(fnCode, filePath);
        /* eslint no-new-func:off */
        return new (Function.prototype.bind.apply(Function, [null].concat((0, _toConsumableArray3.default)(fnArgs.concat([fnCode])))))();
    }
}

function applyInjections(fn, deps, dependencyInjectionArr) {
    fn = fn || noop;
    var fnStr = fn.toString();

    if (new RegExp(config.CONSTANT.INJECT_IDENTIFIER).test(fnStr)) {
        var isNew = {};
        dependencyInjectionArr.forEach(function (d) {
            return isNew[d.path] = true;
        });

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(dependencyInjectionArr), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var injection = _step.value;

                var pattern = injection.pattern ? new RegExp(injection.pattern) : null;

                if (pattern instanceof RegExp) {
                    for (var i = 0, l = deps.length; i < l; i++) {
                        if (pattern.test(deps[i]) && !isNew[deps[i]]) {
                            deps[i] = injection.path;
                        }
                    }
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
}
function checkCond(cond) {
    var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;

    return new _promise2.default(function (resolve) {
        var waitTimer = setInterval(function () {
            if (cond()) {
                clearInterval(waitTimer);
                resolve();
            }
        }, time);
    });
}

function find(el, selector) {
    var m = selector.match(/([#\.\[])([\w\W]+)/i);
    var type,
        key,
        attrName,
        result = [];
    if (m) {
        if (m[1] == ".") {
            type = "class";key = m[2];
        } else if (m[1] == "#") {
            type = "id";key = m[2];
        }if (m[1] == "[") {
            type = "attr";
            m = m[2].match(/(\w+)=(\w+)/i);
            attrName = m[1];
            key = m[2];
        }
    } else {
        type = "tag";key = selector;
    }

    function findChild(node) {
        var c;
        for (var i = 0; i < node.childNodes.length; i++) {
            c = node.childNodes[i];
            if (type == "class" && c.className == key) {
                result.push(c);
                return;
            } else if (type == "id" && c.id == key) {
                result.push(c);
                return;
            } else if (type == "attr" && c.getAttribute && c.getAttribute(attrName) == key) {
                result.push(c);
                return;
            } else if (type == "tag" && c.tagName && c.tagName.toLowerCase() == key) {
                result.push(c);
                return;
            }
            findChild(c);
        }
    }
    findChild(el);
    return result;
}
/**
 * 父元素下包含的子img节点是否展示
 * @param {*} cls 父元素节点或者选择器
 */
var isSubImgShow = function isSubImgShow(cls) {
    var ele = typeof cls == "string" ? document.querySelector(cls) : cls;
    var imgs = find(ele, "img"),
        show = true;
    imgs.forEach(function (element) {
        if (show && !element.src) {
            show = false;
        }
    }, this);
    return false;
};
var scrollV = function scrollV(y) {
    return new _promise2.default(function (resolve, reject) {
        var posy = 0,
            inc = y / 10;
        var scrollTimer = setInterval(function () {
            posy += inc;
            if (posy >= y) {
                clearInterval(scrollTimer);
                resolve();
            }
            window.scrollTo(0, posy);
        }, 100);
    });
};
var scrollH = function scrollH(x, cls) {
    var ele = document.body;
    if (cls) {
        ele = typeof cls == "string" ? document.querySelector(cls) : cls;
    }
    var rect = ele.getBoundingClientRect();
    var widthAll = Math.abs(rect.left) + Math.abs(rect.width);
    x = Math.abs(x);
    if (x >= widthAll) {
        x = widthAll;
    }
    ele.style.transform = "translate3d(-" + x + "px, 0px, 0px)";
};

module.exports = {
    getFunctionCode: getFunctionCode,
    getFunctionArgs: getFunctionArgs,
    instrumentFunction: instrumentFunction,
    applyInjections: applyInjections,
    waitForCondition: waitForCondition,
    isSubImgShow: isSubImgShow,
    scrollV: scrollV,
    scrollH: scrollH
};