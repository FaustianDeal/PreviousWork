/* eslint-disable no-console */
import chalk from 'chalk';
import express from 'express';
import history from 'connect-history-api-fallback';
import morgan from 'morgan';
import path from 'path';
// import compression from 'compression';
import open from 'open';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import getWebpackConfig from '../webpack.config.dev';
import portfinder from 'portfinder';

/**
 * Find open port to listen on
 * @param {*} start
 * @param {*} override if supplied use this and only this port.
 * @return {Promise<number>} Promise resolved to open port
 */
function getPort(start, override) {
  return new Promise((resolve, reject) => {
    if (override && !isNaN(override)) {
      return resolve(override);
    }
    portfinder.getPort({ port: start }, (err, port) => {
      if (err) {
        return reject(err);
      }
      return resolve(port);
    });
  });
}

const app = express();
const webpackConfig = getWebpackConfig();
const compiler = webpack(webpackConfig);

app.use(morgan('dev'));
// app.use(compression());
app.use('/coverage', express.static(path.resolve('./coverage/www/')));
app.use('/ems', express.static(path.resolve('./example/ems/')));

// static
app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  noInfo: true,
  stats: {
    chunks: false,
    colors: true,
  },
}));
app.use(webpackHotMiddleware(compiler, { path: '/__webpack_hmr' }));
app.use(history());

getPort(3001, process.env.DEV_PORT)
  .then(port => {
    let host = process.env.DEV_HOST || 'localhost';
    if (port !== 3001) {
      console.log(chalk.yellow('Warning', 'default port was already in use'));
    }
    app.listen(port, host, () => {
      console.log('Listening on', chalk.green([host, port].join(':')));
      open('http://localhost:' + port);
    });
  })
  .catch(reason => {
    console.error(chalk.red('Error:', reason));
  });

export default app;
