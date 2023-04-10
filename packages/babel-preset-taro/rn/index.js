const PLATFORM_TYPE = require('@tarojs/shared').PLATFORM_TYPE
const reactNativeBabelPreset = require('metro-react-native-babel-preset')
const { merge } = require('lodash')
const fs = require('fs')
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
    'process.env.TARO_ENV': 'rn',
    'process.env.TARO_PLATFORM': PLATFORM_TYPE.RN,
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
    if (process.env.NODE_ENV === 'development') {
      envConst['process.env.NODE_ENV'] = 'development'
    } else {
      envConst['process.env.NODE_ENV'] = 'production'
    }
  }
  return envConst
}

function parseDefineConst (config) {
  const result = {}
  Object.keys(config.defineConstants).forEach((key) => {
    try {
      result[key] = JSON.parse(config.defineConstants[key])
    } catch (e) {
      console.error('defineConstants error: ', e)
      result[key] = ''
    }
  })
  return result
}

/**
 * 配置常量
 * @returns {*}
 */
function getDefineConstants () {
  const config = getProjectConfig()
  const rnconfig = getRNConfig()
  const env = getEnv()
  if (rnconfig.defineConstants) {
    return {
      ...parseDefineConst(rnconfig),
      ...env
    }
  }
  if (config.defineConstants) {
    return {
      ...parseDefineConst(config),
      ...env
    }
  }
  return env
}

function getCSSModule () {
  const rnconfig = getRNConfig()
  if (rnconfig.postcss && rnconfig.postcss.cssModules) {
    return rnconfig.postcss.cssModules.enable
  }
  return false
}

module.exports = (_, options = {}) => {
  if(!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development'
  }
  const {
    decoratorsBeforeExport,
    decoratorsLegacy
  } = options
  if (options.framework && !['react', 'preact'].includes(options.framework)) {
    throw new Error(`Value "${options.framework}" of option "framework" is not supported for React-Native`)
  }

  // taro-rn api/lib 支持按需引入
  const nativeApis = require('@tarojs/taro-rn/apiList.js')
  const nativeLibs = require('@tarojs/taro-rn/libList.js')
  const nativeInterfaces = nativeApis.concat(nativeLibs)

  const defineConstants = getDefineConstants()
  const presets = []
  const plugins = []
  const { enableMultipleClassName = false, enableMergeStyle = false } = getRNConfig()

  presets.push(reactNativeBabelPreset(_, options))
  plugins.push(
    // React 17 jsx runtime 兼容
    [require('@babel/plugin-transform-react-jsx'), {
      runtime: options.reactJsxRuntime || 'automatic'
    }],
    [require('babel-plugin-transform-react-jsx-to-rn-stylesheet'), { enableCSSModule: getCSSModule(), enableMultipleClassName }]
  )
  if (enableMergeStyle) {
    plugins.push([require('babel-plugin-jsx-attributes-array-to-object'), { attributes: ['style'] }])
  }
  plugins.push(
    [require('babel-plugin-transform-imports-api').default, {
      packagesApis: new Map([
        ['@tarojs/taro', new Set(nativeInterfaces)],
        ['@tarojs/taro-rn', new Set(nativeInterfaces)]
      ]),
      usePackgesImport: true, // Whether to use packagesImport
      packagesImport: {
        '^@tarojs/components(-rn)?$': {
          transform: '@tarojs/components-rn/dist/components/${member}'
        },
        '^@tarojs/taro(-rn)?$': {
          transform: (importName) => {
            if (nativeLibs.includes(importName)) {
              return `@tarojs/taro-rn/dist/lib/${importName}`
            } else {
              return '@tarojs/taro-rn/dist/api'
            }
          },
          skipDefaultConversion: true
        }
      }
    }],
    [require('babel-plugin-global-define'), defineConstants]
  )

  // 添加一个默认 plugin, 与小程序/h5保持一致.
  plugins.push(
    [require('@babel/plugin-proposal-decorators'), {
      decoratorsBeforeExport,
      legacy: decoratorsLegacy !== false
    }]
  )

  plugins.push(require('../remove-define-config'))

  plugins.push(
    [require('babel-plugin-minify-dead-code-elimination'), {}]
  )

  return {
    presets,
    plugins
  }
}
