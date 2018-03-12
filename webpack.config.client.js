const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3001',
    'webpack/hot/only-dev-server',
    './client/index'
  ],
  target: 'web',
  module: {
    loaders: [{
      test: /.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: [
          'env',
          'react'
        ],
        "plugins": [
          "transform-class-properties",
          "react-hot-loader/babel"
        ]
      },
    },
    // {
    //   test: /\.css$/,
    //   loader: "style-loader!css-loader"
    // },
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader?sourceMap'
    },
    // {
    //   test: /\.(woff2?|ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
    //   loader: 'file-loader',
    // },
    // { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    //   loader: "url-loader?limit=10000&mimetype=application/font-woff"
    // }, 
    {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url-loader?limit=10000&mimetype=application/font-woff"
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url-loader?limit=10000&mimetype=application/font-woff"
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url-loader?limit=10000&mimetype=application/octet-stream"
      // loader: 'file-loader',
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: "file-loader"
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      // loader: 'file-loader',
      loader: "url-loader?limit=10000&mimetype=image/svg+xml"
    }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'BUILD_TARGET': JSON.stringify('client')
      }
    })
  ],
  devServer: {
    host: 'localhost',
    port: 3001,
    historyApiFallback: true,
    hot: true
  },
  output: {
    path: path.join(__dirname, '.build'),
    publicPath: 'http://localhost:3001/',
    filename: 'client.js'
  }
}