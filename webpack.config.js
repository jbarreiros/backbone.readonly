var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'backbone.readonly.js',
    libraryTarget: 'umd',
    library: 'backbone.readonly',
  },
  externals: {
    'backbone': {
      root: 'Backbone',
      commonjs2: 'backbone',
      commonjs: 'backbone',
      amd: 'backbone'
    },
    'underscore': {
      root: '_',
      commonjs2: 'underscore',
      commonjs: 'underscore',
      amd: 'underscore'
    }
  }
};
