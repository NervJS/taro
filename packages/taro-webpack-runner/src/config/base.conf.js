const path = require('path')

const Util = require('../util')

module.exports = function (config) {
  const { staticDirectory = 'static' } = config
  const imgName = `${staticDirectory}/images/[name].[ext]`
  const mediaName = `${staticDirectory}/media/[name].[ext]`
  const fontName = `${staticDirectory}/fonts/[name].[ext]`
  const extName = `${staticDirectory}/ext/[name].[ext]`
  const imgLimit = (config.module && config.module.base64 && config.module.base64.imageLimit) || 2000
  const fontLimit = (config.module && config.module.base64 && config.module.base64.fontLimit) || 2000

  return {
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.js|jsx$/,
              exclude: /node_modules/,
              use: [{
                loader: require.resolve('babel-loader'),
                options: {
                  cacheDirectory: true,
                  presets: [
                    [require.resolve('babel-preset-env'), {
                      targets: {
                        browsers: [
                          'Android >= 4',
                          'iOS >= 6'
                        ]
                      }
                    }]
                  ],
                  plugins: [
                    require.resolve('babel-plugin-syntax-dynamic-import'),
                    require.resolve('babel-plugin-transform-decorators-legacy'),
                    require.resolve('babel-plugin-transform-class-properties'),
                    require.resolve('babel-plugin-transform-object-rest-spread'),
                    [require.resolve('babel-plugin-transform-react-jsx'), {
                      pragma: 'Nerv.createElement'
                    }]
                  ]
                }
              }]
            },
            {
              test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
              loader: require.resolve('file-loader'),
              options: {
                name: mediaName
              }
            },
            {
              test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
              loader: require.resolve('file-loader'),
              options: {
                limit: fontLimit,
                name: fontName
              }
            },
            {
              test: /\.(png|jpe?g|gif|bpm|svg)(\?.*)?$/,
              loader: require.resolve('url-loader'),
              options: {
                limit: imgLimit,
                name: imgName
              }
            },
            {
              exclude: /\.js|\.css|\.scss|\.sass|\.html|\.json|\.ejs$/,
              loader: require.resolve('url-loader'),
              options: {
                limit: 2000,
                name: extName
              }
            }
          ]
        }
      ]
    },
    resolve: {
      mainFields: ['main', 'module'],
      symlinks: false,
      modules: [path.join(Util.getRootPath(), 'node_modules'), 'node_modules']
    },
    resolveLoader: {
      modules: [path.join(Util.getRootPath(), 'node_modules'), 'node_modules']
    }
  }
}
