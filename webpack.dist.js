const webpack = require('webpack');
const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react'
};
var reactDOMExternal = {
  root: 'ReactDOM',
  commonjs2: 'react-dom',
  commonjs: 'react-dom',
  amd: 'react-dom'
};

module.exports = {
  entry: {
    'react-video-preview': ['./third-party/adapter-latest.js', './src/index.js'],
    'react-video-preview.min': ['./third-party/adapter-latest.js', './src/index.js']
  },

  externals: {
    'react': reactExternal,
    'react-dom': reactDOMExternal
  },

  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'VideoPreview',
    publicPath: '/',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }
    ]
  },

  plugins: [
    new UglifyJSPlugin({
      include: /\.min\.js$/,
      minimize: true,
      compress: {
        warnings: false
      }
    })
  ]
};
