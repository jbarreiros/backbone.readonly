module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon', 'browserify'],
    files: [
      'test/**/*.spec.js',
    ],
    preprocessors: {
      'test/**/*.spec.js': ['browserify', 'coverage']
    },
    browserify: {
      debug: true,
      ignoreTransform: 'browserify-shim',
    },
    reporters: ['mocha', 'coverage'],
    mochaReporter: {
      output: 'autowatch'
    },
    coverageReporter: {
      dir: 'build-reports/coverage/',
      reporters: [
        {type: 'text', subdir: '.', file: 'coverage-summary.txt'},
        {type: 'lcov', subdir: 'report-lcov'},
      ],
    },
    port: 9876,
    colors: true,
    //logLevel: config.LOG_DEBUG,
    singleRun: false,
    autowatch: true,
    browsers: [
      'PhantomJS',
      'Chrome',
      'Firefox'
    ],
  });
};
