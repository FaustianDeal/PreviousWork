require('babel-register')();
const getWebpackConfig = require('./webpack.config.test').default;

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'src/unit-tests.js',
    ],
    exclude: [
    ],
    preprocessors: {
      'src/**/*.js': ['webpack'],
    },
    reporters: ['progress', 'coverage', 'junit'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'text-summary' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' },
        { type: 'cobertura', subdir: '.', file: 'cobertura-coverage.xml' },
        { type: 'html', subdir: 'www' },
      ],
    },
    junitReporter: {
      outputDir: 'coverage',
      useBrowserName: false,
    },
    logLevel: config.LOG_WARN,
    webpack: getWebpackConfig(),
    webpackMiddleware: {
      noInfo: true,
      stats: {
        colors: false,
        chunks: false,
      },
    },
    // use chrome headless for testing
    browsers: ['Headless'],
    singleRun: true,
    customLaunchers: {
      Headless: {
        base: 'ChromeHeadless',
        displayName: 'Headless',
        flags: [
          // --no-sandbox is required for Jenkins
          '--no-sandbox',
        ],
      },
    },
  });
};
