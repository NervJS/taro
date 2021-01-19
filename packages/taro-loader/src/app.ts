import * as webpack from 'webpack'
import { getOptions, stringifyRequest } from 'loader-utils'
import { normalizePath } from '@tarojs/helper'

import { frameworkMeta } from './utils'

export default function (this: webpack.loader.LoaderContext) {
  const stringify = (s: string): string => stringifyRequest(this, s)

  const options = getOptions(this)
  const { importFrameworkStatement, frameworkArgs, creator } = frameworkMeta[options.framework]
  const config = JSON.stringify(options.config)
  const loaders = this.loaders
  const thisLoaderIndex = loaders.findIndex(item => normalizePath(item.path).indexOf('@tarojs/taro-loader') >= 0)
  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  global._prerender = inst
}`
  return `import { ${creator}, window } from '@tarojs/runtime'
import component from ${stringify(this.request.split('!').slice(thisLoaderIndex + 1).join('!'))}
${importFrameworkStatement}
var config = ${config};
window.__taroAppConfig = config
var inst = App(${creator}(component, ${frameworkArgs}))
${options.prerender ? prerender : ''}
`
}
