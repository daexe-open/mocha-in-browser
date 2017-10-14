function loadScript(url, cb) {
	var script = document.createElement('script');
	script.src = url;
	script.onload = function () {
		cb && cb()
	};

	document.head.appendChild(script);
}
if (!document.getElementById("mocha")) {
	let mochaBox = document.createElement('div');
	mochaBox.id = "mocha"
	document.body.appendChild(mochaBox)
}
if(window.userConfig){
	userConfig = userConfig.testConfig
	loadScript("http://127.0.0.1:"+userConfig.serverPort + "/tap-test-lib/html2canvas.js");
	// loadScript("/tap-test/tap-test-lib/escodegen.js");
	loadScript("http://127.0.0.1:"+userConfig.serverPort + "/tap-test-lib/init.js");
}


