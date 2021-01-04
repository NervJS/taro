import postcss, { ProcessOptions } from 'postcss'
import pxtransform from 'postcss-pxtransform'
import postcssImport from 'postcss-import'
import { recursiveMerge } from '@tarojs/helper'
import { resolveStyle } from '../utils'
import stylelintConfig from '../config/rn-stylelint.json'

export interface Config {
  options: ProcessOptions; // https://github.com/postcss/postcss#options
  scalable: boolean; // 控制是否对 css value 进行 scalePx2dp 转换
  pxtransform: {
    enable: boolean;
    config: any;
  },
}

const defaultPxtransformOption: {
  [key: string]: any
} = {
  enable: true,
  config: {
    platform: 'rn'
  }
}

export function getPostcssPlugins ({
  designWidth,
  deviceRatio,
  postcssConfig,
  transformOptions
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
      resolve: function resolve (id, basedir, options) {
        return resolveStyle(
          id,
          {
            ...options,
            basedir,
            platform: transformOptions.platform
          }
        )
      }
    }),
    require('stylelint')(stylelintConfig),
    require('postcss-reporter')({ clearReportedMessages: true })
  ]

  if (pxtransformOption.enable) {
    plugins.push(pxtransform(pxtransformOption.config))
  }

  return plugins
}

export default function transform (src: string, filename: string, { options, plugins }) {
  return postcss(plugins)
    .process(src, { from: filename, ...options })
    .then(result => {
      const css = result.css
      return css
    })
}
