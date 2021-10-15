import postcss, { ProcessOptions } from 'postcss'
import pxtransform from 'postcss-pxtransform'
import postcssImport from 'postcss-import'
import { recursiveMerge } from '@tarojs/helper'
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

  return plugins
}

export default function transform (src: string, filename: string, { options, plugins }) {
  return postcss(plugins)
    .process(src, { from: filename, ...options })
    .then(result => {
      return result
    })
}
