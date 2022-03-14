import * as webpack from 'webpack'
import { getOptions, stringifyRequest } from 'loader-utils'
import { normalizePath } from '@tarojs/helper'
import * as path from 'path'
import { getPageConfig } from './page'

export default function (this: webpack.loader.LoaderContext) {
  const options = getOptions(this)
  const { importFrameworkStatement, frameworkArgs, isNeedRawLoader, creatorLocation } = options.loaderMeta
  const { config: loaderConfig } = options
  const config = getPageConfig(loaderConfig, this.resourcePath)
  const configString = JSON.stringify(config)
  const stringify = (s: string): string => stringifyRequest(this, s)
  // raw is a placeholder loader to locate changed .vue resource
  const raw = path.join(__dirname, 'raw.js')
  const loaders = this.loaders
  const thisLoaderIndex = loaders.findIndex(item => normalizePath(item.path).indexOf('@tarojs/taro-loader/lib/native-component') >= 0)
  const componentPath = isNeedRawLoader
    ? `${raw}!${this.resourcePath}`
    : this.request.split('!').slice(thisLoaderIndex + 1).join('!')
  const runtimePath = Array.isArray(options.runtimePath) ? options.runtimePath : [options.runtimePath]
  const setReconciler = runtimePath.reduce((res, item) => {
    return res + `import '${item}'\n`
  }, '')
  const { globalObject } = this._compilation.outputOptions

  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  ${globalObject}._prerender = inst
}`

  return `${setReconciler}
import { defaultReconciler } from '@tarojs/shared'
import { container, SERVICE_IDENTIFIER } from '@tarojs/runtime'
import { createNativeComponentConfig } from '${creatorLocation}'
${importFrameworkStatement}
var hooks = container.get(SERVICE_IDENTIFIER.Hooks)
hooks.initNativeApiImpls = (hooks.initNativeApiImpls || []).concat(defaultReconciler.initNativeApi)
var component = require(${stringify(componentPath)}).default
var config = ${configString};
var inst = Component(createNativeComponentConfig(component, ${frameworkArgs}))
${options.prerender ? prerender : ''}
`
}
