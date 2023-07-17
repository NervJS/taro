const PLATFORM_TYPE = require('@tarojs/shared').PLATFORM_TYPE
const reactNativeBabelPreset = require('metro-react-native-babel-preset')
const { merge } = require('lodash')
const path = require('path')
const helper = require('@tarojs/helper')
/**
 *
 * 获取项目级配置
 *
 */
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}
const {
  getModuleDefaultExport,
  createSwcRegister,
  resolveScriptPath,
} = helper
let config = {}
const appPath = process.cwd()
const CONFIG_DIR_NAME = 'config'
const DEFAULT_CONFIG_FILE = 'index'
const configPath = resolveScriptPath(path.join(appPath, CONFIG_DIR_NAME, DEFAULT_CONFIG_FILE))
createSwcRegister({
  only: [
    filePath => filePath.indexOf(path.join(process.cwd(), CONFIG_DIR_NAME)) >= 0
  ]
})
try {
  const userExport = getModuleDefaultExport(require(configPath))
  config = typeof userExport === 'function' ? userExport(merge) : userExport
} catch (err) {
  console.warn(err)
}
const rnconfig = config.rn || {}

/**
 * 配置环境变量
 */
function getEnv () {
  const envConst = {
    'process.env.TARO_ENV': 'rn',
    'process.env.TARO_PLATFORM': PLATFORM_TYPE.RN,
  }

  if (config.env) {
    for (const [key, value] of Object.entries(config.env)) {
      try {
        envConst[`process.env.${key}`] = JSON.parse(value)
      } catch {
        console.error('env环境配置有误' + value)
      }
    }
  }

  const nodeEnv = process.env.NODE_ENV || 'production'
  envConst['process.env.NODE_ENV'] = config.env?.NODE_ENV || nodeEnv === 'development' ? 'development' : 'production'

  return envConst
}

function parseDefineConst (defineConstants) {
  const result = {}
  for (const [key, value] of Object.entries(defineConstants)) {
    try {
      result[key] = JSON.parse(value)
    } catch (e) {
      console.error('defineConstants error: ', e)
      result[key] = ''
    }
  }
  return result
}

/**
 * 配置常量
 * @returns {*}
 */
function getDefineConstants () {
  const env = getEnv()
  const constantsToParse = rnconfig?.defineConstants || config?.defineConstants
  
  return {
    ...(constantsToParse ? parseDefineConst(constantsToParse) : {}),
    ...env
  }
}

function getCSSModule () {
  if (rnconfig.postcss && rnconfig.postcss.cssModules) {
    return rnconfig.postcss.cssModules.enable
  }
  return false
}

module.exports = (_, options = {}) => {
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
  const { enableMultipleClassName = false, enableMergeStyle = false } = rnconfig

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
