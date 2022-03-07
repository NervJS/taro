import * as path from 'path'
import { sync as resolveSync } from 'resolve'
import postcss, { ProcessOptions } from 'postcss'
import pxtransform from 'postcss-pxtransform'
import postcssImport from 'postcss-import'
import { recursiveMerge, isNpmPkg, printLog, processTypeEnum } from '@tarojs/helper'
import { resolveStyle } from '../utils'
import reporterSkip from '../utils/reporterSkip'
import stylelintConfig from '../config/rn-stylelint.json'

export interface Config {
  options: ProcessOptions; // https://github.com/postcss/postcss#options
  scalable: boolean; // 控制是否对 css value 进行 scalePx2dp 转换
  pxtransform: {
    enable: boolean;
    config: any;
  };
}

const defaultPxtransformOption: {
  [key: string]: any
} = {
  enable: true,
  config: {
    platform: 'rn'
  }
}

export function makePostcssPlugins ({
  filename,
  designWidth,
  deviceRatio,
  postcssConfig,
  transformOptions,
  additionalData
}) {
  const optionsWithDefaults = ['pxtransform', 'postcss-import', 'postcss-reporter', 'stylelint', 'cssModules']

  if (designWidth) {
    defaultPxtransformOption.config.designWidth = designWidth
  }

  if (deviceRatio) {
    defaultPxtransformOption.config.deviceRatio = deviceRatio
  }
  const pxtransformOption = recursiveMerge({}, defaultPxtransformOption, postcssConfig.pxtransform)

  const plugins = [
    postcssImport({
      resolve: function resolve (id: string, basedir: string, options: postcssImport.AtImportOptions) {
        return resolveStyle(
          id,
          {
            ...options,
            basedir,
            defaultExt: '.css', // 省略后缀则默认 `.css`
            alias: postcssConfig.alias,
            platform: transformOptions.platform
          }
        )
      }
    })
  ]

  if (pxtransformOption.enable) {
    plugins.push(pxtransform(pxtransformOption.config))
  }

  const skipRows = additionalData ? additionalData.split('\n').length : 0

  plugins.push(
    require('stylelint')(stylelintConfig),
    reporterSkip({ skipRows, filename }),
    require('postcss-reporter')({ clearReportedMessages: true })
  )

  Object.entries(postcssConfig).forEach(([pluginName, pluginOption]) => {
    if (optionsWithDefaults.indexOf(pluginName) > -1) return
    if (!pluginOption || !(pluginOption as any).enable) return

    if (!isNpmPkg(pluginName)) { // local plugin
      pluginName = path.join(process.cwd(), pluginName)
    }

    try {
      const pluginPath = resolveSync(pluginName, { basedir: process.cwd() })
      plugins.push(require(pluginPath)((pluginOption as any).config || {}))
    } catch (e) {
      const msg = e.code === 'MODULE_NOT_FOUND' ? `缺少postcss插件${pluginName}, 已忽略` : e
      printLog(msg, processTypeEnum.WARNING)
    }
  })

  return plugins
}

export default function transform (src: string, filename: string, { options, plugins }) {
  return postcss(plugins)
    .process(src, { from: filename, ...options })
    .then(result => {
      return result
    })
}
