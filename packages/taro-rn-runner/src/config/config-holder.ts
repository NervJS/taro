import { merge } from 'lodash'

import { Config, RNConfig } from '../types'

const fs = require('fs')

let config: Config
let rnConfig: RNConfig

const getConfig = () => {
  if (config) return config
  const fileName = `${process.cwd()}/config/index.js`
  if (fs.existsSync(fileName)) {
    config = require(`${process.cwd()}/config/index`)(merge)
    return config
  } else {
    console.warn('缺少项目基本配置')
    config = {}
    return config
  }
}

const getRNConfig = () => {
  getConfig()
  if (rnConfig) return rnConfig
  if (config.rn) {
    rnConfig = config.rn
  } else {
    rnConfig = {}
  }
  return rnConfig
}

const getRNConfigEntry = () => {
  getRNConfig()
  return rnConfig.entry || 'app'
}

const getRNConfigOutput = (p) => {
  getRNConfig()
  if (rnConfig.output) {
    if (p === 'ios') {
      return rnConfig.output.ios
    } else {
      return rnConfig.output.android
    }
  } else {
    return null
  }
}

const getRNConfigTransformer = () => {
  getRNConfig()
  if (rnConfig.transformer) {
    return rnConfig.transformer
  } else {
    return null
  }
}

const getRNConfigBabelPlugin = () => {
  getRNConfig()
  if (rnConfig.babelPlugin) {
    return rnConfig.babelPlugin
  } else {
    return null
  }
}

export { getConfig, getRNConfig, getRNConfigBabelPlugin, getRNConfigEntry, getRNConfigOutput, getRNConfigTransformer }
