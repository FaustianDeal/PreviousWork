/* eslint-disable no-console */
import path from 'path';
import webpack from 'webpack';
import getWebpackConfig from '../webpack.config.prod';
import chalk from 'chalk';

console.log(chalk.blue('Generating development bundle...'));
process.env.NODE_ENV = 'development';

webpack(getWebpackConfig()).watch({
  aggregateTimeout: 1500,
  poll: 10000,
}, (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return 1;
  }

  if (stats.hasErrors()) {
    console.error(stats.errors);
  }
  if (stats.hasWarnings()) {
    console.warn(stats.warnings);
  }

  const summary = stats.toString({
    exclude: [/node_modules/],
    context: path.resolve(__dirname, '..', 'src'),
    modules: true,
    colors: true,
    errors: true,
    warnings: true,

    assets: false,
    cached: false,
    children: false,
    chunks: false,
    moduleTrace: false,
    performance: false,
    reasons: false,
    source: false,
    timings: false,
    hash: false,
  });

  console.log(summary);
  if (stats.hasErrors()) {
    console.log(chalk.red('compledted with errors'));
  } else if (stats.hasWarnings()) {
    console.log(chalk.yellow('completed with warnings'));
  } else {
    console.log(chalk.green('completed successfully'));
  }
  return stats.hasErrors() ? 1 : 0;
});
