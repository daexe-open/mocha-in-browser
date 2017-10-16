## mocha-in-browser
mocha in browser which can auto load test cases from user config file and can also provide useful test util methods
## usage
install mocha-in-browser
```
npm install mocha-in-browser --save-dev
```
mocha-in-browser 是问了方便你更好的编写mocha测试代码，如果在项目中使用，你还需要安装mocha，package.json中的配置参考：
```
...
"scripts": {
    "test": "./node_modules/.bin/mocha ./test/main.spec.js",
},
....
 "devDependencies": {
	 "mocha": "^4.0.1",
     "mocha-in-browser": "^1.0.0",
	 ....

```
## write test cases





