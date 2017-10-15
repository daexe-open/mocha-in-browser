require('mocha-generators').install();
var Nightmare = require('nightmare');
var chai = require('chai');
var asPromised = require('chai-as-promised');
var path = require('path')

const MOCHA_DONE_SIGNAL = 'TEST_MOCHA_DONE';
chai.use(asPromised);
let expect = chai.expect;
let should = chai.should();
let iphone6_ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1";
let defaultUtilPath = path.resolve(__dirname, "util.js");
/**
 * 抽象测试用例基类，主测试用例继承该类，配置config
 * {
		configPath: 配置文件路径，默认"./test/inject.conf.js", 
		utilPath: 导入util,方便测试的js纯函数,
        addr:  需要打开的测试页面，默认"", 
        ua: 需要配置的useragent，默认iphone6_ua, 
        width: 需要设置的屏幕宽度，默认375, 
        height: 需要设置的屏幕宽度，默认677,
        headless: 是否采用无头浏览器，默认true,
		closeAfter: 执行完一个用例后是否关闭
    }
 */
class mainSpecBase {
	constructor(config) {
		config.configPath = path.resolve(process.cwd(), config.configPath || "");
		let utilPath = path.resolve(process.cwd(), config.utilPath || "");

		this.config = Object.assign({
			configPath: "./test/inject.conf.js",
			addr: "",
			ua: iphone6_ua,
			width: 375,
			height: 677,
			headless: true,
			closeAfter: true
		}, config);

		// this.executeCommonTest();
		this.executeE2ETest();
	}
	finish(nightmare, done, err = "") {
		let { closeAfter } = this.config;
		if (closeAfter) {
			nightmare.end().then(() => {
				done(err);
			});
		} else {
			done(err);
		}
	}
    /**
     * 执行通用测试用例
     */
	executeCommonTest() {
		let { width, height, ua, addr, headless, configPath } = this.config;
		describe('execute common test cases in browser', () => {
			it('test common util', (done) => {
				let nightmare = Nightmare({
					show: !headless
				});
				nightmare
					.viewport(width, height)
					.useragent(ua)
					.goto(addr)
					.inject('js', configPath)
					.on('console', (type, ...args) => {
						var content = args.join('')
						if (type === 'log') {
							if (!/^do|html2canvas|circular|alternately|数据不存在|开发环境/.test(content)) {
								let results = args.map(function (v) {
									return typeof v === 'string' ? v.replace('✓', '\u221A').replace('✖', '\u00D7').replace('․', '.') : (v && v.toString()) || ''
								}).filter(function (v) {
									return !/stdout:/.test(v)
								})
								console.log.apply(console, results)
							}
						} else if (type === 'warn') {
							if (new RegExp(MOCHA_DONE_SIGNAL).test(content)) {
								this.finish(nightmare, done);
							}
						}
					}).then().catch((error) => {
						this.finish(nightmare, done, error);
					});
			});
		});
	}
    /**
     * 执行e2e测试用例
     */
	executeE2ETest() {
		let { width, height, ua, addr, configPath, headless, e2eCases } = this.config;

		describe('execute e2e test with nightmarejs', () => {
			let nightmare;
			beforeEach(function () {
				// 在本区块的每个测试用例之前执行

				if (!nightmare || nightmare.ended) {
					nightmare = Nightmare({
						show: !headless,
						waitTimeout: 10000,
						loadTimeout: 10000
					});
					nightmare
						.viewport(width, height)
						.useragent(ua)
						.goto(addr)
						.inject('js', defaultUtilPath)
						

				}
			});
			this.getE2eCases().forEach((casen) => {
				it(casen.title, (done) => {
					casen.action(expect, done, (err) => {
						this.finish(nightmare, done, err);
					}, nightmare);
				});
			})

		});
	}
	/**
	* e2e测试用例集合，子类继承重写
	*/
	getE2eCases() {
		return [];
	}
}
module.exports = mainSpecBase;
