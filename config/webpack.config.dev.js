'use strict';

var cssimport = require('postcss-import');
var simplevars = require('postcss-simple-vars');
var nested = require('postcss-nested');
var cssnext = require('postcss-cssnext');
//var postcssModules = require('postcss-modules');
var cssnano = require('cssnano');

var atImport = require('postcss-import');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
var getClientEnvironment = require('./env');
var paths = require('./paths');

var publicPath = '/';
var publicUrl = '';
var env = getClientEnvironment(publicUrl);

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    main: [
      require.resolve('react-hot-loader/patch'), // RHL patch
      require.resolve('react-dev-utils/webpackHotDevClient'),
      // We ship a few polyfills by default:
      require.resolve('./polyfills'),
      paths.appIndexJs
    ],
    vendor: [
      'react',
      'react-dom'
    ]
  },
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: paths.appBuild,
    filename: '[name].js',
    publicPath: publicPath
  },
  resolve: {
    modules: ['node_modules'].concat(paths.nodePaths),
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
      src: paths.appSrc,
      assets: paths.appPublic
    }
  },
  module: {
    rules: [
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)(\?.*)?$/,
          /\.css|\.scss$/,
          /\.svg$/,
          /\.png$/,
          /\.jpg$/,
        ],
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[path][name].[ext]'
        }
      },
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        use: [
          {
            loader: 'react-hot-loader/webpack',
          },
          {
            loader: 'babel-loader',
            options: {
              'presets': [
                ['es2015', {'loose': true, 'modules': false}],
                'react',
                'stage-2'
              ],
              'plugins': [
                'transform-decorators-legacy',
                'transform-class-properties',
                'transform-object-rest-spread'
              ]
            }
          }
        ]
      },
      {
        test: /\.css|\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                cssimport(),
                simplevars(),
                nested(),
                cssnext({ warnForDuplicates: false }),
                cssnano()
              ]
            }
          }
        ],
      },
      {
        test: /\.svg|\.png|\.jpg$/,
        loader: 'file-loader',
        query: {
          name: '[path][name].[ext]'
        }
      }
    ]
  },
  plugins: [
    //new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'build/vendor.[hash].js' }),
    //new InterpolateHtmlPlugin(env.raw),
    new HtmlWebpackPlugin({
      inject: false,
      template: paths.appHtml,
    }),
    new webpack.DefinePlugin(Object.assign({},
      env.stringified,
      {
        BUILD_BROWSER: true,
        BUILD_PRODUCTION: false
      })
    ),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
