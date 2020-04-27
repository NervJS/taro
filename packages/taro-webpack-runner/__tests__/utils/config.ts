export default {
  router: {
    mode: 'hash',
    customRoutes: {},
    basename: '/'
  },
  publicPath: '/',
  staticDirectory: 'static',
  postcss: {
    autoprefixer: {
      enable: true,
      config: {}
    },
    cssModules: {
      enable: false,
      config: {
        namingPattern: 'module',
        generateScopedName: '[name]__[local]___[hash:base64:5]'
      }
    }
  },
  deviceRatio: {
    640: 1.17,
    750: 1,
    828: 0.905
  },
  env: {
    NODE_ENV: '"production"',
    TARO_ENV: '"h5"'
  },
  alias: {},
  copy: {
    patterns: [],
    options: {}
  },
  defineConstants: {},
  designWidth: 750,
  entryFileName: 'app',
  isWatch: false,
  outputRoot: 'dist',
  plugins: [],
  sourceRoot: 'src'
}
