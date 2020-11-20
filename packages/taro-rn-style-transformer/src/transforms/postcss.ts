import postcss, { ProcessOptions } from 'postcss'
import autoprefixer from 'autoprefixer'
import pxtransform from 'postcss-pxtransform'
import postcssImport from 'postcss-import'
import postcssUrl from 'postcss-url'
import { recursiveMerge } from '@tarojs/helper'
import resolveId from '../utils/resolveId'

export interface Config {
  options: ProcessOptions; // https://github.com/postcss/postcss#options
  scalable: boolean; // 控制是否对 css value 进行 scalePx2dp 转换
  pxtransform: {
    enable: boolean;
    config: any;
  },
  autoprefixer: {
    enable: boolean;
    config: any;
  },
  url: {
    enable: boolean;
    config: any;
  },
}

const defaultAutoprefixerOption = { // 供应商前缀，rn应该不需要
  enable: false,
  config: {
    flexbox: 'no-2009'
  }
}

const defaultPxtransformOption: {
  [key: string]: any
} = {
  enable: true,
  config: {
    platform: 'rn'
  }
}

const defaultUrlOption: { // url() 内容内嵌，rn应该不需要
  [key: string]: any
} = {
  enable: false,
  config: {
    limit: 1000,
    url: 'inline'
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
  const autoprefixerOption = recursiveMerge({}, defaultAutoprefixerOption, postcssConfig.autoprefixer)
  const pxtransformOption = recursiveMerge({}, defaultPxtransformOption, postcssConfig.pxtransform)
  const urlOption = recursiveMerge({}, defaultUrlOption, postcssConfig.url)

  const plugins = [postcssImport({
    resolve: function resolve (id, base, options) {
      return resolveId(id, base, { ...options, platform: transformOptions.platform })
    }
  })]
  if (autoprefixerOption.enable) {
    plugins.push(autoprefixer(autoprefixerOption.config))
  }

  if (pxtransformOption.enable) {
    plugins.push(pxtransform(pxtransformOption.config))
  }
  if (urlOption.enable) {
    plugins.push(postcssUrl(urlOption.config))
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
