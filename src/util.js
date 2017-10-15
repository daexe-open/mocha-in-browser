

var noop = () => true

function getFunctionCode(fnStr) {
	return fnStr.replace(/^function(.|[\r\n])*?\{[\s\r\n]*/, '').replace(/\}$/, '')
}

function getFunctionArgs(fnStr) {
	return fnStr.match(/^function(.|[\r\n])*?\{/)[0].match(/\((.|[\r\n])*\)/)[0].replace(/[()]/g, '').replace(/\/\/.*/g, '').replace(/\/\*(.|[\r\n])*\*\//g, '').replace(/[\s\r\n]/g, '').split(',')
}


function checkCond(cond, time = 200) {
	return new Promise((resolve) => {
		let waitTimer = setInterval(function () {
			if (cond()) {
				clearInterval(waitTimer);
				resolve();
			}
		}, time);
	});
}

async function waitForCondition(value, ms) {
	await checkCond(value, ms);
	return;
}
function find(el, selector) {
	var m = selector.match(/([#\.\[])([\w\W]+)/i);
	var type, key, attrName, result = [];
	if (m) {
		if (m[1] == ".") {
			type = "class"; key = m[2];
		} else if (m[1] == "#") {
			type = "id"; key = m[2];
		} if (m[1] == "[") {
			type = "attr";
			m = m[2].match(/(\w+)=(\w+)/i);
			attrName = m[1];
			key = m[2];
		}
	} else {
		type = "tag"; key = selector;
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
let isSubImgShow = function (cls) {
	let ele = typeof cls == "string" ? document.querySelector(cls) : cls;
	let imgs = find(ele, "img"), show = true;
	imgs.forEach(function (element) {
		if (show && !element.src) {
			show = false;
		}
	}, this);
	return show;
}
let scrollV = function (y) {
	return new Promise(function (resolve, reject) {
		let posy = 0, inc = y / 10;
		let scrollTimer = setInterval(function () {
			posy += inc;
			if (posy >= y) {
				clearInterval(scrollTimer);
				resolve()
			}
			window.scrollTo(0, posy)
		}, 100)
	});
}
let scrollH = function (x, cls) {
	let ele = document.body;
	if (cls) {
		ele = typeof cls == "string" ? document.querySelector(cls) : cls;
	}
	let rect = ele.getBoundingClientRect();
	let widthAll = Math.abs(rect.left) + Math.abs(rect.width);
	x = Math.abs(x);
	if (x >= widthAll) {
		x = widthAll;
	}
	ele.style.transform = "translate3d(-" + x + "px, 0px, 0px)"
}

window.testUtil = {
	getFunctionCode,
	getFunctionArgs,
	checkCond,
	waitForCondition,
	isSubImgShow,
	scrollV,
	scrollH
}
