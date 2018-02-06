// webpack.config.js
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './client/index.js'
  ],
  output: {
    path: path.join(__dirname, 'client'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './client',
    hot: true
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
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
    {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }]
  }
}