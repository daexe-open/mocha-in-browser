"use strict";

/**
 * 获取元素渲染图像的data数据
 * @param {node} ele 元素节点
 * @param {function} cb 回调函数
 */

function getElementImageData(ele, cb) {

	if (!window.html2canvas) {
		cb("");
	}

	html2canvas(ele).then(function (canvas) {
		cb(canvas.getContext("2d").getImageData(0, 0, parseInt(getComputedStyle(ele).width, parseInt(getComputedStyle(ele).height))));
	});
}

function diffImageData(imgUrl, imgData) {}

module.exports = {
	getElementImageData: getElementImageData,
	diffImageData: diffImageData,
	html2canvas: window.html2canvas
};