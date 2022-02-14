import * as webpack from 'webpack'
import { getOptions, stringifyRequest } from 'loader-utils'
import { normalizePath } from '@tarojs/helper'

export default function (this: webpack.loader.LoaderContext) {
  const stringify = (s: string): string => stringifyRequest(this, s)

  const options = getOptions(this)
  const { importFrameworkStatement, frameworkArgs, creator, creatorLocation, modifyInstantiate } = options.loaderMeta
  const config = JSON.stringify(options.config)
  const blended = options.blended
  const pxTransformConfig = options.pxTransformConfig
  const loaders = this.loaders
  const thisLoaderIndex = loaders.findIndex(item => normalizePath(item.path).indexOf('@tarojs/taro-loader') >= 0)
  const { globalObject } = this._compilation.outputOptions

  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  ${globalObject}._prerender = inst
}`

  const runtimePath = Array.isArray(options.runtimePath) ? options.runtimePath : [options.runtimePath]
  const setReconciler = runtimePath.reduce((res, item) => {
    return res + `import '${item}'\n`
  }, '')

  const createApp = `${creator}(component, ${frameworkArgs})`

  let instantiateApp = blended
    ? `
var app = ${createApp}
app.onLaunch()
exports.taroApp = app
`
    : `var inst = App(${createApp})`

  if (typeof modifyInstantiate === 'function') {
    instantiateApp = modifyInstantiate(instantiateApp, 'app')
  }

  return `${setReconciler}
import { window } from '@tarojs/runtime'
import { ${creator} } from '${creatorLocation}'
import { initPxTransform } from '@tarojs/taro'
import component from ${stringify(this.request.split('!').slice(thisLoaderIndex + 1).join('!'))}
${importFrameworkStatement}
var config = ${config};
window.__taroAppConfig = config
${instantiateApp}
${options.prerender ? prerender : ''}
initPxTransform({
  designWidth: ${pxTransformConfig.designWidth},
  deviceRatio: ${JSON.stringify(pxTransformConfig.deviceRatio)}
})
`
}
