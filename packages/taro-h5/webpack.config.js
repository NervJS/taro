const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './server/index.js',
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './server/index.html'
    })
  ],
  devServer: {
    port: 9000
  }
}
