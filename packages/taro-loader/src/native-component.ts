import * as webpack from 'webpack'
import { getOptions, stringifyRequest } from 'loader-utils'
import { normalizePath } from '@tarojs/helper'
import * as path from 'path'
import { frameworkMeta } from './utils'
import { getPageConfig } from './page'

export default function (this: webpack.loader.LoaderContext) {
  const options = getOptions(this)
  const { importFrameworkStatement, frameworkArgs } = frameworkMeta[options.framework]
  const { framework, config: loaderConfig } = options
  const config = getPageConfig(loaderConfig, this.resourcePath)
  const configString = JSON.stringify(config)
  const stringify = (s: string): string => stringifyRequest(this, s)
  const { isNeedRawLoader } = frameworkMeta[framework]
  // raw is a placeholder loader to locate changed .vue resource
  const raw = path.join(__dirname, 'raw.js')
  const loaders = this.loaders
  const thisLoaderIndex = loaders.findIndex(item => normalizePath(item.path).indexOf('@tarojs/taro-loader/lib/native-component') >= 0)
  const componentPath = isNeedRawLoader
    ? `${raw}!${this.resourcePath}`
    : this.request.split('!').slice(thisLoaderIndex + 1).join('!')
  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  global._prerender = inst
}`

  return `import { createNativeComponentConfig } from '@tarojs/runtime'
import component from ${stringify(componentPath)}
${importFrameworkStatement}
var config = ${configString};
var inst = Component(createNativeComponentConfig(component, ${frameworkArgs}))
${options.prerender ? prerender : ''}
`
}
