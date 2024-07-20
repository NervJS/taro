export default {
  projectName: 'test',
  defineConstants: {},
  designWidth: 750,
  deviceRatio: {
    640: 1.17,
    750: 1,
    828: 0.905
  },
  alias: {},
  copy: {
    patterns: [],
    options: {}
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  isWatch: false,
  csso: undefined,
  sass: undefined,
  terser: undefined,
  plugins: [],
  compiler: 'webpack5',
  env: {
    NODE_ENV: '"production"'
  },
  baseLevel: undefined,
  postcss: {
    pxtransform: {
      enable: true,
      config: {}
    },
    url: {
      enable: true,
      config: {
        limit: 1024
      }
    },
    cssModules: {
      enable: false,
      config: {
        namingPattern: 'module',
        generateScopedName: '[name]__[local]___[hash:base64:5]'
      }
    }
  }
}
