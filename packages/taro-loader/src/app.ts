import * as path from 'node:path'

import { REG_POST } from './constants'
import { entryCache } from './entry-cache'
import { stringifyRequest } from './util'

import type * as webpack from 'webpack'

export default function (this: webpack.LoaderContext<any>, source: string, map?: any) {
  const stringify = (s: string): string => stringifyRequest(this, s)
  const options = this.getOptions()
  const { importFrameworkStatement, frameworkArgs, creator, creatorLocation, modifyInstantiate } = options.loaderMeta
  const config = JSON.stringify(options.config)
  const blended = options.blended
  const newBlended = options.newBlended
  const pxTransformConfig = options.pxTransformConfig
  const { globalObject } = this._compilation?.outputOptions || { globalObject: 'wx' }
  const entryCacheLoader = path.join(__dirname, 'entry-cache.js') + '?name=app'
  entryCache.set('app', {
    source,
    map
  })

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

  // 共享运行时（split 模式）多包 App 隔离：createReactApp 前把本包 pkgId 记进共享全局
  // __currentPkgId，供 createReactApp 把 realApp 存进 shared.__pkgApps[pkgId]，page loader
  // onLoad 前据此查回本包 App。
  //
  // 同时给 config.appId 注入 pkgId:renderReactRoot 用 config.appId 作 container 元素 id，
  // 两包都用默认 'app' 会 mount 到同一 container、React root 互相覆盖（A→B→A 后 A 白屏）。
  // pkgId 业务包间唯一（chunkLoadingGlobal 派生），用作 appId 天然隔离 container。
  // 仅 sharedRuntime 场景注入，非共享模式产物字面零变化。
  const sharedRuntimePkgIdInject = options.sharedRuntime
    ? `
if (typeof ${globalObject}[${JSON.stringify(options.sharedRuntimeGlobalKey)}] !== 'undefined') {
  ${globalObject}[${JSON.stringify(options.sharedRuntimeGlobalKey)}].__currentPkgId = ${JSON.stringify(options.sharedRuntimePkgId)}
}
config.appId = ${JSON.stringify(options.sharedRuntimePkgId)}
`
    : ''

  return `${setReconciler}
import { window } from '@tarojs/runtime'
import { ${creator} } from '${creatorLocation}'
import { initPxTransform } from '@tarojs/taro'
${setReconcilerPost}
import component from ${stringify(['!', entryCacheLoader, this.resourcePath].join('!'))}
${importFrameworkStatement}
var config = ${config};
window.__taroAppConfig = config
${sharedRuntimePkgIdInject}${instantiateApp}
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
