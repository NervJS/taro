import * as path from 'node:path'

import { entryCache } from './entry-cache'
import { getPageConfig } from './page'
import { stringifyRequest } from './util'

import type * as webpack from 'webpack'

export default function (this: webpack.LoaderContext<any>, source: string, map?: any) {
  const options = this.getOptions()
  const { loaderMeta = {}, config: loaderConfig, isNewBlended = false, runtimePath } = options
  const { importFrameworkStatement, frameworkArgs, isNeedRawLoader, creatorLocation } = loaderMeta
  const config = getPageConfig(loaderConfig, this.resourcePath)
  config.isNewBlended = isNewBlended
  // 共享运行时 native-components 场景：注入 pkgId + 全局键名 + isNativeShared 三字段，
  // connect-native.ts createNativeComponentConfig 据此走第三分支——按 pkgId 存/查
  // shared.__nativeComponentApps，不共用 Current.app 与单例 nativeComponentApp。
  // 仅 sharedRuntime 注入，非共享场景 config 结构不变。
  if (options.sharedRuntime) {
    config.isNativeShared = true
    config.pkgId = options.sharedRuntimePkgId
    config.globalKey = options.sharedRuntimeGlobalKey
    // container 隔离：与 pages 同源，避免 initNativeComponentEntry 硬编码 #app 导致多包冲突
    config.appId = options.sharedRuntimePkgId
  }
  const configString = JSON.stringify(config)
  const stringify = (s: string): string => stringifyRequest(this, s)
  const pageName = options.name
  const behaviorsName = options.behaviorsName
  // raw is a placeholder loader to locate changed .vue resource
  const entryCacheLoader = path.join(__dirname, 'entry-cache.js') + `?name=${pageName}`
  entryCache.set(pageName, {
    source,
    map
  })
  const raw = path.join(__dirname, 'raw.js')
  const componentPath = isNeedRawLoader
    ? ['!', raw, entryCacheLoader, this.resourcePath].join('!')
    : ['!', entryCacheLoader, this.resourcePath].join('!')
  const processedRuntimePath = Array.isArray(runtimePath) ? runtimePath : [runtimePath]
  const setReconciler = processedRuntimePath.reduce((res, item) => {
    if (/^@tarojs\/plugin-(react|vue)-devtools/.test(item)) return res
    return res + `import '${item}'\n`
  }, '')
  const { globalObject } = this._compilation?.outputOptions || { globalObject: 'wx' }

  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  ${globalObject}._prerender = inst
}`

  return `${setReconciler}
import { createNativeComponentConfig } from '${creatorLocation}'
${importFrameworkStatement}
var component = require(${stringify(componentPath)}).default
var config = ${configString};
var taroOption = createNativeComponentConfig(component, ${frameworkArgs})
if (component && component.behaviors) {
  taroOption.${behaviorsName} = (taroOption.${behaviorsName} || []).concat(component.behaviors)
}
var inst = Component(taroOption)
${options.prerender ? prerender : ''}
export default component
`
}
