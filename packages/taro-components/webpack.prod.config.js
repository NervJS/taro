const path = require('path')

module.exports = {
  entry: './src/components/index.js',
  resolve: {
    extensions: ['.js', '.scss', '.css']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'taroComponents'
  },
  externals: {
    nervjs: 'commonjs2 nervjs',
    classnames: 'commonjs2 classnames',
    weui: 'commonjs2 weui',
    'omit.js': 'commonjs2 omit.js',
    '@tarojs/taro-h5': 'commonjs2 @tarojs/taro-h5'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            'presets': [
              [
                '@babel/env',
                {
                  'spec': true,
                  'useBuiltIns': false
                }
              ]
            ],
            'plugins': [
              [
                '@babel/plugin-transform-react-jsx',
                {
                  'pragma': 'Nerv.createElement'
                }
              ],
              ['@babel/plugin-proposal-object-rest-spread']
            ]
          }
        }]/*, 'eslint-loader' */
      },
      {
        test: /\.scss$/,
        loaders: [
          {
            loader: 'style-loader',
            options: {
              insertAt: 'top'
            }
          },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      }
    ]
  }
}
