const path = require('path')
const apis = require('@tarojs/taro-h5/dist/taroApis')

module.exports = {
  entry: './src/index.js',
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
                '@babel/preset-env',
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
              ['@babel/plugin-proposal-decorators', { 'legacy': true }],
              ['@babel/plugin-proposal-class-properties'],
              ['@babel/plugin-proposal-object-rest-spread'],
              ['babel-plugin-transform-taroapi', {
                apis,
                packageName: '@tarojs/taro-h5'
              }]
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
      },
      {
        test: /\.(png|jpe?g|gif|bpm|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 2000,
          name: 'img/[name].[ext]'
        }
      }
    ]
  }
}
