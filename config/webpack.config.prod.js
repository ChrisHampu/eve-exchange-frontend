'use strict';

var cssimport = require('postcss-import');
var simplevars = require('postcss-simple-vars');
var nested = require('postcss-nested');
var cssnext = require('postcss-cssnext');
var cssnano = require('cssnano');

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var paths = require('./paths');
var getClientEnvironment = require('./env');

var publicPath = paths.servedPath;
var shouldUseRelativeAssetPaths = publicPath === './';
var publicUrl = publicPath.slice(0, -1);

var env = getClientEnvironment(publicUrl);

// Development builds of React are slow and not intended for production.
if (env.stringified['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

// This is the production configuration.
module.exports = {
  bail: true,
  devtool: 'source-map',
  entry: {
    main: [
      require.resolve('./polyfills'),
      paths.appIndexJs
    ],
    vendor: [
      'react',
      'react-dom'
    ]
  },
  output: {
    // The build folder.
    path: paths.appBuild,
    // Generated JS file names (with nested folders).
    filename: '[name].js',
    publicPath: publicPath
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We read `NODE_PATH` environment variable in `paths.js` and pass paths here.
    // We use `fallback` instead of `root` because we want `node_modules` to "win"
    // if there any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ['node_modules'].concat(paths.nodePaths),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
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
          /\.(js|jsx)$/,
          /\.css$/,
          /\.scss$/,
          /\.json$/,
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
            'transform-react-inline-elements'
          ]
        }
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
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.svg|\.png|\.jpg$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      }
    ]
  },
  plugins: [
    // Enable this once chunk sizes start becoming significant in size
    //new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10240 }),
    new webpack.DefinePlugin(Object.assign({},
      env.stringified, {
        BUILD_BROWSER: JSON.stringify(true),
        BUILD_PRODUCTION: JSON.stringify(true)
      })
    ),
    // Minify the code.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
