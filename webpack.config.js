'use strict';

const path = require('path');
const webpack = require('webpack');
const utils = require('./webpack/utils');

const LOCAL_ENV = 'local';
const DEV_ENV = 'development';
const PROD_ENV = 'production';

const BUILD_FOLDER  = './build';
const PUBLIC_FOLDER = './build/js';

const NODE_ENV = process.env.NODE_ENV || DEV_ENV;
const APP_FOLDER = process.cwd();
const BUILD_FILE = './index.js';

const config = {
  entry: path.join(APP_FOLDER, BUILD_FOLDER, BUILD_FILE),
  output: {
    path :path.join(APP_FOLDER, PUBLIC_FOLDER),
    publicPath: 'js/',
    filename: `bundle.js`
  },
  externals: {
    "react": "React",
    "redux": "Redux",
    "react-dom": "ReactDOM",
    "react-redux": "ReactRedux",
    "config": JSON.stringify(require('./build-config'))
  },
  watch: NODE_ENV === LOCAL_ENV,
  devtool: NODE_ENV === DEV_ENV?'source-map': false,
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV:JSON.stringify(NODE_ENV),
      'process.env.NODE_ENV':JSON.stringify(NODE_ENV),
      DEV_ENV:JSON.stringify(DEV_ENV)
    }),
  ],
  module: {
    loaders:[
      { test:/\.json$/, loader:"json-loader" },
      { test: /\.js$/, loader:'babel-loader', exclude:/node_modules/, options: {
        babelrc: false,
        presets: ['es2015','stage-0','react'],
        plugins: [
          'transform-decorators-legacy',
          'transform-class-properties',
          'transform-runtime'
        ]
      }}
    ]
  },
  devServer: {
    contentBase: './build',host:'0.0.0.0'
  }
};

if (NODE_ENV === PROD_ENV) {
  config.plugins.push(utils.Uglify());
  config.plugins.push(utils.GZip());
  config.module.loaders[1].options.presets.push('react-optimize');
}

module.exports = config;


