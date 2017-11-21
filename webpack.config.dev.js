import path from 'path';
import pkg from './package';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

/**
 * build the webpack configuration
 * @return {WebpackConfiguration} configuration
 */
export default function getWebpackConfig() {
  const moduleName = pkg.name.replace(/^@[^\/]*[\/]/, '');
  const config = {
    devtool: 'inline-source-map',
    entry: {
      middleware: 'webpack-hot-middleware/client',
      [moduleName]: './example/index',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          loader: 'source-map-loader',
          exclude: [
            // modules with bad sourcemaps?
            path.resolve(__dirname, 'node_modules', '@uirouter'),
          ],
        },
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
          exclude: /node_modules/,
          use: ['html-loader', 'pug-html-loader'],
        },
        {
          test: /\.(c|le)ss$/,
          exclude: /node_modules/,
          use: ['style-loader', 'css-loader', 'less-loader'],
        },
        {
          test: /\.(eot|svg|ttf|woff2?)(\?v=\d+\.\d+\.\d+)?/,
          use: ['file-loader?name=fonts/[name].[ext]'],
        },
        {
          test: /\.(png|jpg|svg|gif)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              useRelativePath: true,
              outputPath: 'images',
            },
          },
        },
      ],
    },
    output: {
      path: path.resolve('/'),
      publicPath: '',
      library: pkg.name,
      libraryTarget: 'umd',
      umdNamedDefine: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        PACKAGE_MODULE_NAME: JSON.stringify(moduleName),
        DEBUG_LOGGING: true,
      }),
      // Create HTML file that includes reference to bundled JS
      new HtmlWebpackPlugin({
        template: '!!pug-loader!example/index.pug',
        inject: true,
      }),
      // dev plugin to refresh browser when it works
      new webpack.HotModuleReplacementPlugin(),
      // Prevent webpack from writing files when there are errors
      new webpack.NoEmitOnErrorsPlugin(),
    ],
  };

  return config;
}
