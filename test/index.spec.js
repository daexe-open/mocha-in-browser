import config from '../src/config-default';
import { expect } from 'chai';
const CONSTANT =  {
        COVERAGE_IDENTIFIER: 'test-cover',
        MOCHA_DONE_SIGNAL: 'TEST_MOCHA_DONE',
        HAS_COVERAGE_SIGNAL: 'COVERAGE_OBJECT'
    }
describe('should have config-default', () => {
    it('have MOCHA_DONE_SIGNAL', () => {
        expect(config.CONSTANT.MOCHA_DONE_SIGNAL).to.equal(CONSTANT.MOCHA_DONE_SIGNAL);
	});
	it('have HAS_COVERAGE_SIGNAL', () => {
        expect(config.CONSTANT.HAS_COVERAGE_SIGNAL).to.equal(CONSTANT.HAS_COVERAGE_SIGNAL);
    });
    
});
