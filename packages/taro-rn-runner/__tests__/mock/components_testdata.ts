const path = require('path')
const { recursiveMerge } = require('@tarojs/helper')
const getConfig = require('./config/index')

const appPath = path.resolve(__dirname, '.', '')

const _config = getConfig(recursiveMerge)
const config = {
  isBuildNativeComp: true,
  ..._config,
  ..._config.rn
}

export {
  config,
  appPath
}
