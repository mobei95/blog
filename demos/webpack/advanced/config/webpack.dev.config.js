const webpack = require('webpack')
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const apiMocker = require('mocker-api');
const mockApi = require('../mock.js')
module.exports = {
  mode: 'development',
  devServer: {
    before(app) {
      apiMocker(app, path.resolve('../mock.js'))
    },
    prot: '8080', // 端口
    host: 'localhost',
    hot: true, // 开启热更新
    progress: true // 进度条
  },
  devtool: 'cheap-module-eval-source-map',  // source-map
  plugins: [
    new HtmlWebpackPlugin({ // 使用模板
      template: '../index.html',  // 模板路径
      filename: 'index.html', // 构建后的文件名
      hash: true  // 文件名hash
    }),
    new webpack.DefinePlugin({  
      DEV: JSON.stringify('dev')  // 环境变量
    }),
    new webpack.HotModuleReplacementPlugin(), // 热更新插件
  ]
};