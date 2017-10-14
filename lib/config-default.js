'use strict';

module.exports = {
    headless: false,
    shouldBrowserClosed: false,
    coverage: false,
    coverageOptions: {
        reporters: 'icov'
    },
    mochaOptions: {
        /**
        * The time to wait before mocha tests exit.
        *
        * Default to 3000 ms.
        */
        timeout: 3000,
        /**
        * The mocha reporter.
        * Currently only perfectly support 'spec', 'doc', 'json', 'xunit', and 'tap'
        *
        * Default to 'spec'.
        */
        reporter: 'spec',
        /**
        * Whether the report should have colors
        *
        * Default to true.
        */
        useColors: true
        // 
        // And other supported mocha options
        // ...
    },
    CONSTANT: {
        COVERAGE_IDENTIFIER: 'test-cover',
        MOCHA_DONE_SIGNAL: 'TEST_MOCHA_DONE',
        HAS_COVERAGE_SIGNAL: 'COVERAGE_OBJECT'
    }
};