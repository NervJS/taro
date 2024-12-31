const path = require('path')


let componentPath = ''
function tryGetComponentPath() {
  const args = process.argv;
  const keyIndex = args.indexOf('--components');
  if(keyIndex > -1) { 
    componentPath = args[keyIndex + 1];
  }
}
tryGetComponentPath()

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
  plugins: [ 
    ['@tarojs/plugin-intl'],
    path.join(process.cwd(), '/plugin-mv/index.js')],
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: {
      enable: false
    }
  },
  terser: {
    enable: false
  },
  mini: {
    enableSourceMap: false,
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
    enableExtract: false,
    publicPath: '/',
    staticDirectory: 'static',
    webpackChain(chain) {
      chain.merge({
        output: {
          libraryTarget: 'umd',
          library: ['taroComponents', 'NativeComponent'],
          chunkLoadingGlobal: 'NativeComponentJsonp',
        },
        optimization: {
          splitChunks: {
            cacheGroups: {
              default: false,
              vendors: false,
              // 强制将动态导入的模块打包到主包中
              main: {
                chunks: 'all',
                name: componentPath || 'components/multiLanDemo/index',
                enforce: true,
              },
            },
          },
        },
      })
    },
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
