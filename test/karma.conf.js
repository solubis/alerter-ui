// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html

module.exports = function (config) {
    'use strict';

    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        files: [
            {pattern: 'src/data/**/*.json', watch: true, served: true, included: false},

            './node_modules/phantomjs-polyfill/bind-polyfill.js',

            'demo/i18n.js',
            'dist/js/vendor.js',
            'src/scripts/**/*.js',

            'lib/angular-mocks/angular-mocks.js',
            'lib/jasmine-jquery/lib/jasmine-jquery.js',

            'test/*-spec.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 9876,

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            'Chrome'
        ],

        plugins: ['karma-jasmine', 'karma-phantomjs-launcher', 'karma-chrome-launcher'],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_DEBUG
    });
};
