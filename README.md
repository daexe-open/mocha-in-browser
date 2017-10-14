## tap-test
方便进行斑马模块测试，目前支持mocha单元测试，代码覆盖率检测正在完善中。

## usage
安装tap-test
```
tnpm install @ali/tap-test -g
...
tap-test --help
tap-test -p 8888 //执行tap-test服务运行端口
tap-test -t pc //指定tap-test运行模拟终端展示的类型，可以在tap.test.conf.js中预定义
```
1. 需要在项目根目录配置配置文件 tap.test.conf.js , 内容如下：

```
userConfig = {

    testConfig: {
        serverPort: 8878,
        coverage: false,
        serverPath: "./",
        configPath: "./conf.js",
        testType: "h5",
        pc: {
            width: 1200,
            height: 800
        },
        h5: {
            width: 414,
            height: 736
        },
        headless: false,
        shouldBrowserClosed: true,
        addr: [
            "https://chaoshi.m.tmall.com/", 
            // "http://chaoshi.m.tmall.com/welfare.htm",
            // "http://chaoshi.m.tmall.com/i.htm",
            "https://chaoshi.m.tmall.com/fresh.htm",
            "https://chaoshi.m.tmall.com/daily-sale.htm",
            // "https://chaoshi.m.tmall.com/mine.htm",
            "https://chaoshi.m.tmall.com/industry-market.htm"
        ]
    }
}
module.exports= userConfig
```
注意上面的testConfig中的addr 支持数组形式，每个地址会单独运行，然后整体关闭。上面配置的conf.js是注入到页面的配置文件，内容示例如下：
```
window.userConfig = {

    testConfig: {
        coverage: false,
        coverageOptions: {
            reporters: 'icov'
        },
        mochaOptions: {
            timeout: 10000, //The time to wait before mocha tests exit.Default to 3000 ms.
            reporter: 'spec', //The mocha reporter.Default to 'spec'
            useColors: true //Whether the report should have colors,Default to true
        },
        addr: "http://chaoshi.m.tmall.com/",
        /* 需要加载的测试文件和待测试文件 */
        injectFiles: [
            'http://127.0.0.1:8878/lib/jquery-3.2.1.min.js',            
            'http://127.0.0.1:8878/inject/html.tpl.js',            
            'http://127.0.0.1:8878/inject/index.spec.js'            
        ]
    }
}
```
这个里面需要配置的injectFiles是跑测试用例的时候浏览器自动加载的文件，需要保证文件可以访问，可以用默认开启的http服务。
2. 在根目录建立test目录，添加测试用例文件coupon.spec.js如下：

```
//注意这里需要引入的是依赖文件打包后的路径名称，而不是相对的地址路径，相对的地址可能会加载不到，因为测试文件打包后不在相同的依赖路径中
// use feloader.require instead of require, 如果使用import 或者 require会导致加载的模块时undefined
let  coupon = feloader.require('mui/zebra-haomou-learn/coupon/coupon')

let data = {
    "couponList": [
        {
            "url": "//chaoshi.m.tmall.com/i.htm",
            "benifitType": "优惠券",
            "startFee": 99,
            "amount": 30,
            "startTime": "2017-06-20",
            "endTime": "2017-09-20",
            "logo": "//img.alicdn.com/tps/TB1NfBLOXXXXXXZaFXXXXXXXXXX-358-202.png",
            "range": "奶粉尿裤"
        }]
}
describe('coupon instance test', () => {
    it('new coupon instance no data', () => {
        expect(new coupon()).to.be.an.instanceof(coupon);
    });
    it('new coupon instance with data', () => {
        expect(new coupon(data.couponList)).to.be.an.instanceof(coupon);
    });

});
describe('coupon event test', () => {
    let couponIns;
    beforeEach(() => {
        couponIns = new coupon(data.couponList)
    });
    it('close event', () => {
        document.body.appendChild(couponIns.$el[0]);
        couponIns.$el.find(".J_close").click()
        expect(document.body.querySelector("J_close")).to.be.null
    })
});
```
3. 需要修改tap.conf.js中关于代理服务的配置，如下：,将test开始的请求转发到tap-test的测试服务上

```
proxy_pass: [ //代理转发规则
      {
        server_name: 'localhost test.tmall.com test.daily.tmall.net',
        rewrite: [
          {
            rule: /^\/tap-test(.+)$/,
            target: 'http://127.0.0.1:8888/$1' //tap-test默认会起在8888端口，可以通过tap-test -p 指定端口
          },{
            rule: /^(.+)$/,
            target: 'http://127.0.0.1:3000/$1' //转发到wormhole服务所在的3000端口
          }
        ]
      },
	  ...
```
4. 然后就可以愉快的测试了，需要先启动tap，然后起测试：

```
tap server

tap-test
```
控制台输出：

```
mocha run ...
----------------------------------------
  coupon instance test
    √ new coupon instance no data
    √ new coupon instance with data

  coupon event test
    √ close event


  3 passing (11ms)
```
OK了，是不是很方便！

### testUtil
tap-test 默认在测试页面中注入了chai的expect和一些常用的testUtil，挂在window下面，你可以直接使用：
```
expect(xx).to.eql(xx)
testUtil.waitForCondition(condition,time).then()
```
testUtil API说明：
-- waitForCondition 等待条件触发
```
describe('test touch operations', function () {
        beforeEach(function (done) {
            ...
        });
        it('render page with test data', function () {
            ...
            return testUtil.waitForCondition(function(){
                return $(".J_CouponItems .mui-chaoshi-item").length;
            }, 200)
			.then(function () {
                window.scroll(0, 1000);
                expect($(".J_CouponItems").children().length).to.be.above(initNum);
            })

        });

    });
```

### todo list
1. 单元测试覆盖率后续会增加上
2. 支持视觉还原度测试，智能比对视觉稿和对应实现效果之间的差异，给出视觉还原度参数和偏差部分
3. 支持UI自动化测试
4. 智能化测试脚本，这是一个长期的设想，支持根据测试用例自动生成部分业务代码，真正实现测试(行为)驱动开发
