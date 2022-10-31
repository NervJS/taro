const path = require('path')

const appPath = path.resolve(__dirname, '.', '')

const config = {
  entry: 'app',
  copy: { patterns: [], options: {} },
  sourceRoot: 'src',
  outputRoot: 'dist',
  platform: 'rn',
  framework: 'react',
  baseLevel: undefined,
  csso: undefined,
  sass: { options: {}, additionalData: '' },
  uglify: undefined,
  plugins: [],
  projectName: 'taroRnInit',
  env: { NODE_ENV: '"development"' },
  defineConstants: { __TEST__: '"RN测试静态常量"' },
  designWidth: 750,
  deviceRatio: { 640: 1.17, 750: 1, 828: 0.905 },
  terser: undefined,
  appName: '',
  output:
    {
      android: 'androidbundle/index.bundle',
      ios: 'iosbundle/main.bundle'
    },
  postcss:
    {
      options: {},
      scalable: true,
      pxtransform: { enable: true, config: {} }
    },
  less: { options: {}, additionalData: '' },
  stylus: { options: {}, additionalData: '' },
  EXPLORER_PATH: 'src',
  EXPLORER_SHELL: 'yarn run wb-bundle',
  sourceDir: '',
  isWatch: true,
  mode: 'development',
  modifyWebpackChain: [],
  modifyBuildAssets: [],
  modifyMiniConfigs: [],
  onBuildFinish: [],
  nodeModulesPath:
    path.resolve(__dirname, '../../../..', 'node_modules'),
  deviceType: 'android',
  port: undefined,
  buildAdapter: 'rn',
  globalObject: 'global',
  isBuildNativeComp: true
}

export {
  config,
  appPath
}
