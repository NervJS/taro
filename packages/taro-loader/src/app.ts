import { getOptions, stringifyRequest } from 'loader-utils'
import * as path from 'path'

import { REG_POST } from './constants'
import { entryCache } from './entry-cache'

import type * as webpack from 'webpack'

export default function (this: webpack.LoaderContext<any>, source: string) {
  const stringify = (s: string): string => stringifyRequest(this, s)

  const options = getOptions(this)
  const { importFrameworkStatement, frameworkArgs, creator, creatorLocation, modifyInstantiate } = options.loaderMeta
  const config = JSON.stringify(options.config)
  const blended = options.blended
  const newBlended = options.newBlended
  const pxTransformConfig = options.pxTransformConfig
  const { globalObject } = this._compilation?.outputOptions || { globalObject: 'wx' }
  const entryCacheLoader = path.join(__dirname, 'entry-cache.js') + '?name=app'
  entryCache.set('app', source)

  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  ${globalObject}._prerender = inst
}`

  const runtimePath = Array.isArray(options.runtimePath) ? options.runtimePath : [options.runtimePath]
  let setReconcilerPost = ''
  const setReconciler = runtimePath.reduce((res, item) => {
    if (REG_POST.test(item)) {
      setReconcilerPost += `import '${item.replace(REG_POST, '')}'\n`
      return res
    } else {
      return res + `import '${item}'\n`
    }
  }, '')

  const createApp = `${creator}(component, ${frameworkArgs})`

  let instantiateApp = blended || newBlended
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
${setReconcilerPost}
import component from ${stringify(['!', entryCacheLoader, this.resourcePath].join('!'))}
${importFrameworkStatement}
var config = ${config};
window.__taroAppConfig = config
${instantiateApp}
${options.prerender ? prerender : ''}
initPxTransform({
  designWidth: ${pxTransformConfig.designWidth},
  deviceRatio: ${JSON.stringify(pxTransformConfig.deviceRatio)},
  baseFontSize: ${pxTransformConfig.baseFontSize || 20},
  unitPrecision: ${pxTransformConfig.unitPrecision},
  targetUnit: ${JSON.stringify(pxTransformConfig.targetUnit)}
})
`
}
