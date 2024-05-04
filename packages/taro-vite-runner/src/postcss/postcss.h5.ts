import { isNodeModule } from '@tarojs/helper'

import type { Func, IPostcssOption } from '@tarojs/taro/types/compile'

const platform = 'h5'

const defaultConstparseOption = {
  constants: [
    {
      key: 'taro-tabbar-height',
      val: '50PX'
    }
  ],
  platform
}

const taroModuleRgx = [/@tarojs[/\\_]components/, /\btaro-components\b/]

const defaultEsnextModuleRgx = [
  /@tarojs[/\\_]components/,
  /\btaro-components\b/,
  /@tarojs[/\\_]taro-h5/,
  /\btaro-h5\b/,
  /@tarojs[/\\_]router/,
  /\btaro-router\b/
]

const isTaroModule = (filename: string) => taroModuleRgx.some(reg => reg.test(filename))

const isEsnextModule = (filename: string, esnextModules) => {
  const esnextModuleRules = [...defaultEsnextModuleRgx, ...esnextModules]
  return esnextModuleRules.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(filename)
    } else {
      return filename.indexOf(pattern) > -1
    }
  })
}

const getPostcssExclude = (esnextModules: string []): (fileName: string) => boolean => {
  return (filename) => {
    if (isTaroModule(filename)) {
      return true
    } else if (isEsnextModule(filename, esnextModules)) {
      return false
    } else {
      return isNodeModule(filename)
    }
  }
}

export const getDefaultPostcssConfig = function ({
  designWidth,
  deviceRatio,
  option = {} as IPostcssOption<'h5'>,
  esnextModules
}): [string, any, Func?][] {
  const { autoprefixer, htmltransform, pxtransform = {}, ...options } = option
  if (designWidth) {
    pxtransform.config!.designWidth = designWidth
  }
  if (deviceRatio) {
    pxtransform.config!.deviceRatio = deviceRatio
  }

  // 由于 vite 缺少 postcss 文件的 filter 能力，所以只能针对 postcss-pxtransform 这个插件，在内部进行 filter，后面跟进 vite 的特性可以进行修改
  pxtransform.config!.exclude = getPostcssExclude(esnextModules)

  return [
    ['autoprefixer', autoprefixer, require('autoprefixer')],
    ['postcss-pxtransform', pxtransform, require('postcss-pxtransform')],
    ['postcss-html-transform', htmltransform, require('postcss-html-transform')],
    ['postcss-plugin-constparse', defaultConstparseOption, require('postcss-plugin-constparse')],
    ...Object.entries(options)
  ]
}
