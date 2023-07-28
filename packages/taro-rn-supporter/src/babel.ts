import { injectDefineConfigHeader } from '@tarojs/helper'
import { PLATFORM_TYPE } from '@tarojs/shared'

import type { IProjectConfig } from '@tarojs/taro/types/compile'

function parseDefineConst (defineConstants: Record<string, string>) {
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

function getEnv (config: IProjectConfig) {
  const envConst = {
    'process.env.TARO_ENV': PLATFORM_TYPE.RN,
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

function getDefineConstants (config: IProjectConfig) {
  const env = getEnv(config)
  const constantsToParse = config.rnconfig?.defineConstants || config?.defineConstants
  
  return {
    ...(constantsToParse ? parseDefineConst(constantsToParse) : {}),
    ...env
  }
}

export function getBabelConfig (config: IProjectConfig, isConfigFile = false) {
  const rnConfig = config?.rn || {}
  const plugins: any[] = []
  const { enableMultipleClassName = false, enableMergeStyle = false } = rnConfig
  plugins.push([
    'babel-plugin-transform-react-jsx-to-rn-stylesheet',
    { enableCSSModule: rnConfig.postcss?.cssModules?.enable, enableMultipleClassName },
  ])
  if (enableMergeStyle) {
    plugins.push(['babel-plugin-jsx-attributes-array-to-object', { attributes: ['style'] }])
  }
  const defineConstants = getDefineConstants(config)
  plugins.push(['babel-plugin-global-define', defineConstants])
  if (isConfigFile) {
    plugins.push(injectDefineConfigHeader)
  }
  return {
    plugins: plugins,
  }
}
