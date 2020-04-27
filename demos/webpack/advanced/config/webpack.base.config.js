const webpack = require('webpack')
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: '../client.js',  // 入口
  output: {
    filename: 'main.[hash].js', // 构建文件名
    path: path.resolve(__dirname, 'dist') // 构建文件目录
  },
  resolve: {
    alia: { // 别名配置
      '@': './src'
    },
    modules: ['./src/components', 'node_modules'],  // 模块解析路径
    extensions: ['.js', '.vue', '.json']  // 文件后缀
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        },
        exclude: /node_modules/ // 需要排除的文件夹
      }
    ]
  }
};