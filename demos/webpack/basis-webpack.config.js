const webpack = require('webpack')
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCss = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
  entry: './main.js',
  output: {
    filename: 'main.[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: [
    new OptimizeCss(),
    new UglifyJsPlugin({
      parallel: true
    })
  ],
  devServer: {
    port: '8080',
    progress: true,
    contentBase: './dist'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true
      },
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: 'index.css'
    }),
    new webpack.ProvidePlugin({
      $: "jquery"
    }),
    new CleanWebpackPlugin()
  ],
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
        include: path.resolve(__dirname, 'src'),  // 希望应用的文件夹
        exclude: /node_modules/ // 需要排除的文件夹
      },
      {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'postcss-loader', 'css-loader']
      },
      {
        test: /\.scss/,
        use: [MiniCssExtractPlugin.loader, 'postcss-loader', 'css-loader','scss-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  }
};