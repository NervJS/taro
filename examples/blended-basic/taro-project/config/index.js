const path = require('path')

const config = {
  projectName: 'test',
  date: '2021-1-18',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [path.join(process.cwd(), '/plugin-mv/index.js')],
  framework: 'react',
  alias: {
    '@/utils': process.env.NODE_ENV === 'development'
      ? path.resolve(__dirname, '../../miniapp/utils')
      : path.resolve(__dirname, '../utils'),
    '@/components': process.env.NODE_ENV === 'development'
      ? path.resolve(__dirname, '../src/components')
      : path.resolve(__dirname, '../components')
  },
  mini: {
    enableSourceMap: false,
    addChunkPages (pages) {
      pages.set('subpackages/bar/index', ['subpackages/common']),
      pages.set('subpackages/foo/index', ['subpackages/common'])
    },
    webpackChain (chain) {
      chain.merge({
        externals: [
          (context, request, callback) => {
            const externalDirs = ['@/utils']
            const externalDir = externalDirs.find(dir => request.startsWith(dir))

            if (process.env.NODE_ENV === 'production' && externalDir) {
              const externalDirPath = config.alias[externalDir]
              const res = request.replace('@/utils', path.relative(context, externalDirPath))

              return callback(null, `commonjs ${res}`)
            }

            callback()
          },
        ],
        optimization: {
          splitChunks: {
            cacheGroups: {
              react: {
                name: 'vendors',
                test: module => /[\\/]node_modules[\\/](react-reconciler|scheduler)/.test(module.resource)
              },
              subpackagesCommon: {
                name: 'subpackages/common',
                minChunks: 2,
                test: (module, chunks) => {
                  const isNoOnlySubpackRequired = chunks.find(chunk => !(/\bsubpackages\b/.test(chunk.name)))
                  return !isNoOnlySubpackRequired
                },
                priority: 200
              }
            }
          }
        }
      })
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
