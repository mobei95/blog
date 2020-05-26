const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')
module.exports = {
  entry: {
    main: './index.js'
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '/dist')
  },
  devServer: {
    port: '8888',   // 开发服务端口
    host: 'localhost',
    progress: true, // 配置打包进度条
    contentBase: './dist'   // 指定静态服务的启动文件夹
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',   // 指定模板文件路径
      filename: 'index.html',   // 指定打包后输出的模板文件名
      minify: {   // 指定模板压缩的规则
          removeAttributeQuotes: true,     // 删除属性的双引号
          collapseWhitespace: true,   // 折叠空行
      },
      hash: true // 添加hash戳，hash可以避免缓存问题
    })
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: '/\.js$/',
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
      }
    ]
  }
}