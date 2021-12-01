const config = {
  projectName: '<%= projectName %>',
  date: '<%= date %>',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  // (for harmony) plugins: ['@tarojs/plugin-platform-harmony'],
  plugins: [],
  defineConstants: {
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: '<%= framework %>',
  mini: {
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
    },
    // (for harmony)如果使用开发者工具的预览器（previewer）进行预览的话，需要使用 development 版本的 react-reconciler。
    // 因为 previewer 对长串的压缩文本解析有问题。（真机/远程真机没有此问题）
    debugReact: true,
    // 如果需要真机断点调试，需要关闭 sourcemap 的生成
    enableSourceMap: false
  },
  // harmony 相关配置
  harmony: {
    // 【必填】鸿蒙应用的绝对路径
    projectPath: 'Harmony Application Path',
    // 【可选】HAP 的名称，默认为 'entry'
    hapName: 'entry',
    // 【可选】JS FA 的名称，默认为 'default'
    jsFAName: 'default'
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
