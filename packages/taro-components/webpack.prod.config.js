const path = require('path')

module.exports = {
  entry: './src/components/index.js',
  resolve: {
    extensions: ['.js', '.scss', '.css']
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'taroComponents'
  },
  externals: {
    nervjs: 'commonjs2 nervjs',
    classnames: 'commonjs2 classnames',
    weui: 'commonjs2 weui',
    'omit.js': 'commonjs2 omit.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      }
    ]
  }
}
