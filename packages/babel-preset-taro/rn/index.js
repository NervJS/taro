
const reactNativeBabelPreset = require('metro-react-native-babel-preset')
const helper = require('@tarojs/helper')
const { merge } = require('lodash')
const fs = require('fs')
const path = require('path')
/**
 *
 * 获取项目级配置
 *
 */
let config
let rnConfig
function getProjectConfig () {
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

function getRNConfig () {
  const config = getProjectConfig()
  if (rnConfig) return rnConfig
  if (config.rn) {
    rnConfig = config.rn
  } else {
    rnConfig = {}
  }
  return rnConfig
}

/**
 * 配置环境变量
 */
function getEnv () {
  const config = getProjectConfig()
  const envConst = {
    'process.env.TARO_ENV': 'RN'
  }
  if (config.env) {
    Object.keys(config.env).forEach((key) => {
      try {
        envConst[`process.env.${key}`] = JSON.parse(config.env[key])
      } catch (e) {
        console.error('env环境配置有误' + config.env[key])
      }
    })
  }
  if (!config.env || !config.env.NODE_ENV) {
    if (config.isWatch) {
      envConst['process.env.NODE_ENV'] = 'development'
    } else {
      envConst['process.env.NODE_ENV'] = 'production'
    }
  }
  return envConst
}

function parseDefineConst (config) {
  Object.keys(config.defineConstants).forEach((key) => {
    try {
      config.defineConstants[key] = JSON.parse(config.defineConstants[key])
    } catch (e) {
      console.error('defineConstants环境配置有误')
      config.defineConstants[key] = ''
    }
  })
}

/**
 * 配置常量
 * @returns {*}
 */
function getDefineConstants () {
  const config = getProjectConfig()
  const rnconfig = getRNConfig()
  if (rnconfig.defineConstants) {
    parseDefineConst(rnconfig)
    rnconfig.defineConstants = Object.assign(rnconfig.defineConstants, getEnv())
    return rnconfig.defineConstants
  }
  if (config.defineConstants) {
    parseDefineConst(config)
    config.defineConstants = Object.assign(config.defineConstants, getEnv())
    return config.defineConstants
  }
  return getEnv()
}

/**
 * 配置别名
 * @returns {{}}
 */
function getAlias () {
  const config = getProjectConfig()
  const rnconfig = getRNConfig()
  let alias = {}
  if (rnconfig.alias) {
    alias = rnconfig.alias
  }
  if (config.alias) {
    alias = config.alias
  }
  alias['@tarojs/components'] = '@tarojs/components-rn'
  alias['@tarojs/taro'] = '@tarojs/taro-rn'
  return alias
}

// taro-rn api 部分支持按需引入

const nativeApis = require('./nativeApis')

module.exports = (_, options = {}) => {
  const {
    decoratorsBeforeExport,
    decoratorsLegacy
  } = options
  if (options.framework && options.framework !== 'react') {
    throw new Error(`Value "${options.framework}" of option "framework" is not supported for React-Native`)
  }

  getEnv()
  const defineConstants = getDefineConstants()
  const alias = getAlias()

  const presets = []
  const plugins = []
  const extensions = [].concat(helper.JS_EXT, helper.TS_EXT, helper.CSS_EXT)
  const omitExtensions = options.ts ? ['.tsx', '.ts', '.jsx', '.js'] : ['.jsx', '.js', '.tsx', '.ts']
  const entryFilePath = 'node_modules/metro/src/node-haste/DependencyGraph/assets/empty-module.js'
  const projectRoot = process.cwd()
  presets.push(reactNativeBabelPreset(_, options))
  plugins.push(
    require('babel-plugin-transform-react-jsx-to-rn-stylesheet'),
    [require('babel-plugin-rn-platform-specific-extensions'), {
      extensions: extensions,
      omitExtensions: omitExtensions,
      include: [{ [path.resolve(projectRoot, entryFilePath)]: path.resolve(projectRoot, 'index.js') }]
    }],
    [require('babel-plugin-transform-imports'), {
      '^@tarojs/components(-rn)?$': {
        transform: '@tarojs/components-rn/dist/components/${member}'
      },
      '^@tarojs/taro(-rn)?$': {
        transform: (importName) => {
          if (nativeApis.includes(importName)) {
            return `@tarojs/taro-rn/dist/lib/${importName}`
          } else {
            return '@tarojs/taro-rn/dist/api'
          }
        },
        skipDefaultConversion: true
      }
    }],
    [require('babel-plugin-global-define'), defineConstants],
    [require('babel-plugin-module-resolver'), {
      alias: alias
    }]
  )

  // 添加一个默认 plugin, 与小程序/h5保持一致. todo: 3.1后采用拓展的方式
  plugins.push(
    [require('@babel/plugin-proposal-decorators'), {
      decoratorsBeforeExport,
      legacy: decoratorsLegacy !== false
    }]
  )
  return {
    presets,
    plugins
  }
}
