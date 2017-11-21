import path from 'path';
import pkg from './package';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import OptimizeCSSPlugin from 'optimize-css-assets-webpack-plugin';
import autoprefixer from 'autoprefixer';

/**
 * Build webpack configuration for production
 * @return {WebpackConfiguration} configuration
 */
export default function getWebpackConfig() {
  const moduleName = pkg.name.replace(/^@[^\/]*[\/]/, '');

  //
  // this plugin defines constants that are replaced in source files during
  // build
  //  PACKAGE_MODULE_NAME is replaced with a string containing the name of the module
  //  DEBUG_LOGGING is replaced with either true or false
  //
  const definePlugin = new webpack.DefinePlugin({
    PACKAGE_MODULE_NAME: JSON.stringify(moduleName),
    // disable logging for all production builds
    DEBUG_LOGGING: process.env.NODE_ENV === 'development',
  });

  //
  // this plugin extracts imported .less and .css files and writes them
  // to ${moduleName}.css
  //
  const extractCssPlugin = new ExtractTextPlugin('[name].css');

  //
  // this plugin is used to minify production output.
  // It also can work in conjunction with the define plugin to remove dead
  // or debug code from finaln build
  //
  // if (DEBUG_LOGGING) {
  //    this.debug('this log will be removed');
  // }
  const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({ sourceMap: true });

  //
  // this plugin is used to minify css files.
  //
  const uglifyCssPlugin = new OptimizeCSSPlugin({ sourceMap: true });

  const plugins = [definePlugin, extractCssPlugin];
  if (process.env.NODE_ENV !== 'development') {
    // only minify the true production build
    plugins.push(...[uglifyJsPlugin, uglifyCssPlugin]);
  }

  const config = {
    devtool: 'source-map',
    entry: {
      //
      // Defaulting output to module name.  If bundling in other third party
      // libraries, be sure to add .bundle to the name so there's some indication
      // that the file contains more than 'this' code.  Also update the main
      // entry in package.json to include .bundle in the name.
      //
      [moduleName]: './src/index',
    },
    externals: {
      'angular': 'angular',
      // these are here as samples and can be removed if not a dependency
      // within the module
      'angular-ui-bootstrap': 'angular-ui-bootstrap',
      '@uirouter/angularjs': '@uirouter/angularjs',
    },
    resolve: {
      alias: {
        'angular': require.resolve('angular/angular'),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ng-annotate-loader',
              options: {
                single_quotes: true,
              },
            },
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                cacheDirectory: true,
                presets: [
                  ['env', {
                    targets: {
                      browsers: ['last 2 versions', 'safari >= 7'],
                    },
                  }],
                ],
              },
            },
          ],
        },
        {
          test: /\.pug$/,
          exclude: /(node_modules)/,
          use: ['html-loader', 'pug-html-loader'],
        },
        {
          test: /\.(c|le)ss$/,
          exclude: /node_modules/,
          use: extractCssPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              { loader: 'postcss-loader', options: { plugins: [autoprefixer] } },
              'less-loader',
            ],
          }),
        },
        {
          test: /\.(eot|svg|ttf|woff2?)(\?v=\d+\.\d+\.\d+)?/,
          use: ['file-loader?name=fonts/[name].[ext]'],
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '',
      library: pkg.name,
      libraryTarget: 'umd',
      umdNamedDefine: true,
    },
    plugins: plugins,
  };

  return config;
}
