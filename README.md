## mocha-in-browser
mocha in browser which can auto load test cases from user config file and can also provide useful test util methods
## usage
install mocha-in-browser
```
npm install mocha-in-browser --save-dev
```
mocha-in-browser 是问了方便你更好的编写mocha测试代码，如果在项目中使用，你还需要安装mocha，
package.json中的配置参考：
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
假设你的主测试用例路径是./test/main.spec.js，可以将测试用例分为两个部分：单元/UI测试和E2E测试。其中：
1. 单元测试主要用来测试通用方法，通用类等正确性，当然这些都是抽象出来作为公用的代码，后面任何修改都需要保证代码的正确性。
2. UI测试，这里指的也是通用UI，基本也是可以单独运行测试的。
3. E2E测试，在测试体系中，这部分属于集成测试，主要从整体效果上保证页面展示不会出现什么大问题（比如图片不展示、页面空白等）。
 附上main.spec.js的例子：
 ```
//本项目提供的测试用例基类
let specBase = require('mocha-in-browser/lib/base.spec')
class mainSpec extends specBase {
    constructor(config) {
		//构造函数，传入单元/UI测试用例，和一些配置
        super({
            configPath: "./test/inject.conf.js",
            addr: "http://pages.tmall.com/wow/chaoshi/act/city-pavilion",
            headless: true,
            closeAfter: true
        });
    }
	//e2e测试用例，子类需要覆盖
    getE2eCases() {
        return [
            {
                title: "展示首屏顶部活动图片",
                action: this.sliderAction
            },
            {
                title: "左滑查看往期1，应该展示首屏顶部活动图片",
                action: this.sliderLeft1Action
            },
            {
                title: "左滑查看往期2，应该展示首屏顶部活动图片",
                action: this.sliderLeft2Action
            },
            {
                title: "下滑，应该展示城市特价商品图片",
                action: this.sliderCitySaleAction
            },
            {
                title: "首屏不展示城市优选商品模块",
                action: this.sliderCitySlipAction
            },
            {
                title: "下滑，应该展示城市优选商品图片",
                action: this.sliderCitySlip2Action
            },
            {
                title: "下滑，应该展示城市feeds商品图片",
                action: this.sliderCityFeedsAction
            }
        ]
    }

    sliderAction(expect, done, finish, nightmare) {
        nightmare
            .wait(500)
            .evaluate((param) => {
                let $ = feloader.require('mui/zepto/touch')
                return testUtil.isSubImgShow($(".slide .item")[2]);
            }, "testUtil")
            .then((result) => {
                expect(result).to.be.eql(true);
                done();
                // finish();
            })
            .catch((error) => {
                finish(error);
            })
    }

    sliderLeft1Action(expect, done, finish, nightmare) {
        nightmare
            .click(".pavilion-header .nav>li:nth-child(2)")
            .wait(500)
            .evaluate((param) => {
                let $ = feloader.require('mui/zepto/touch')
                return testUtil.isSubImgShow($(".slide .item")[1]);
            }, "")
            .then((result) => {
                expect(result).to.be.eql(true);
                done();
                // finish();
            })
            .catch((error) => {
                finish(error);
            })
    }
    sliderLeft2Action(expect, done, finish, nightmare) {

        nightmare
            .click(".pavilion-header .nav>li:nth-child(1)")
            .wait(500)
            .evaluate((param) => {
                let $ = feloader.require('mui/zepto/touch')
                return testUtil.isSubImgShow($(".slide .item")[0]);
            }, "")
            .then((result) => {
                expect(result).to.be.eql(true);
                done();
            })
            .catch((error) => {
                finish(error);
            })
    }
    sliderCitySaleAction(expect, done, finish, nightmare) {

        nightmare
            .scrollTo(200, 50)
            .wait(500)
            .evaluate((param) => {
                let $ = feloader.require('mui/zepto/touch')
                return testUtil.isSubImgShow($(".city-sale")[0]);
            }, "")
            .then((result) => {
                expect(result).to.be.eql(true);
                finish();
            })
            .catch((error) => {
                finish(error);
            })
    }
    sliderCitySlipAction(expect, done, finish, nightmare) {

        nightmare
            .wait(500)
            .evaluate((param) => {
                let $ = feloader.require('mui/zepto/touch')
                return $(".city-sideslip-wrap img").length > 0;
            }, "")
            .then((result) => {
                expect(result).to.be.eql(false);
                done();
            })
            .catch((error) => {
                finish(error);
            })
    }
    sliderCitySlip2Action(expect, done, finish, nightmare) {

        nightmare
            .scrollTo(200, 0)
            .wait(500)
            .evaluate((param) => {
                let $ = feloader.require('mui/zepto/touch')
                return $(".city-sideslip-wrap img").length > 0;
            }, "")
            .then((result) => {
                expect(result).to.be.eql(true);
                done();
            })
            .catch((error) => {
                finish(error);
            })
    }
    sliderCityFeedsAction(expect, done, finish, nightmare) {

        nightmare
            .scrollTo(500, 0)
            .wait(500)
            .evaluate((param) => {
                let $ = feloader.require('mui/zepto/touch')
                return testUtil.isSubImgShow($(".city-feeds")[0]);
            }, "")
            .then((result) => {
                expect(result).to.be.eql(true);
                finish();
            })
            .catch((error) => {
                finish(error);
            })
    }


}
new mainSpec();
 ```
 其中关于配置项如下：
 ```
{
	configPath: 配置文件路径，默认"./test/inject.conf.js", 
	utilPath: 导入util,方便测试的js纯函数,
	addr:  需要打开的测试页面，默认"", 
	ua: 需要配置的useragent，默认iphone6_ua, 
	width: 需要设置的屏幕宽度，默认375, 
	height: 需要设置的屏幕宽度，默认677,
	headless: 是否采用无头浏览器，默认true,
	closeAfter: 执行完一个用例后是否关闭
}
 ```
 下面再给个配置文件inject.conf.js的示例：
 ```
window.testConfig = {
    coverage: false,
    coverageOptions: {
        reporters: 'icov'
    },
    cookie:"",
    mochaOptions: {
        timeout: 10000, //The time to wait before mocha tests exit.Default to 3000 ms.
        reporter: 'spec', //The mocha reporter.Default to 'spec'
        useColors: true //Whether the report should have colors,Default to true
    },
    addr: "http://pages.tmall.com/wow/chaoshi/act/city-pavilion",
	 /* 注入的其他类库环境 */
    injectEnv:[
        "http://127.0.0.1:8080/node_modules/mocha-in-browser/lib/main.js" //可以通过url访问的
    ],
    /* 需要加载的测试文件和待测试文件 */
    injectCases: [
        'http://127.0.0.1:8080/test/index.spec.js',//可以通过url访问的
        'http://127.0.0.1:8080/test/util.spec.js'//可以通过url访问的
    ]
}
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
if (window.testConfig) {
    testConfig.injectEnv.forEach(item =>{
        loadScript(item);
    })
}
 ```

建议配合另外一个项目使用：
proxy-ajax： https://github.com/chalecao/proxy-ajax

### LICENCE
MIT

