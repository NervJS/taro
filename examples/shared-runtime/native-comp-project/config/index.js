const path = require('path')

const config = {
  projectName: 'shared-runtime-native-comp',
  date: '2026-9-1',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [path.join(process.cwd(), '/plugin-mv/index.js')],
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: {
      enable: false,
    },
  },
  mini: {
    enableSourceMap: false,
    // 异步核分包在宿主 pages/shared-async-v1/,与 native-comp 业务分包 pages/shared-native-comp/ 平级。
    // sharedRuntimeAsyncRequest 是烧进同步核 taro-shared-sync.js 里的 require.async 目标字符串,
    // 路径以**同步核所在目录**为基准(不是各 native-comp chunk)。同步核搬进宿主后落在
    // pages/shared-native-comp/taro-shared-sync.js,相对到宿主 pages/shared-async-v1/index
    // → '../shared-async-v1/index'(与 taro-project 一致,同步核所在深度相同)。
    sharedRuntimeAsyncRequest: '../shared-async-v1/index',
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: false,
        },
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
