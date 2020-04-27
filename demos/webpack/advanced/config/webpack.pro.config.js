const webpack = require('webpack')
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const apiMocker = require('mocker-api');
const mockApi = require('../mock.js')
module.exports = {
  mode: 'producation',
  devtool: 'source-map',
  plugin: [
    new HtmlWebpackPlugin({ // 使用模板
      template: '../index.html',  // 模板路径
      filename: 'index.html', // 构建后的文件名
      minify: { // 优化项
        removeAttributeQuotes: true,  // 删除属性的双引号
        collapseWhitespace: true  // 删除折行
      },
      hash: true  // 文件名hash
    })，
    new copyWebpackPlugin([ // 静态文件拷贝
      {
        from: path.resolve(__dirname, './public'),
        to: './dist'
      }
    ])
  ]
};