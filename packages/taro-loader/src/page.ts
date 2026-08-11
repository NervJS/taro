import * as path from 'node:path'

import { PLATFORM_TYPE } from '@tarojs/shared'

import { entryCache } from './entry-cache'
import { stringifyRequest } from './util'

import type * as webpack from 'webpack'

interface PageConfig {
  content: any
  path: string
}

export default function (this: webpack.LoaderContext<any>, source: string, map?: any) {
  const options = this.getOptions()
  const { config: loaderConfig } = options
  const config = getPageConfig(loaderConfig, this.resourcePath)
  const configString = JSON.stringify(config)
  const stringify = (s: string): string => stringifyRequest(this, s)
  const pageName = options.name
  const behaviorsName = options.behaviorsName
  const { isNeedRawLoader, modifyInstantiate } = options.loaderMeta
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
  const { globalObject } = this._compilation?.outputOptions || { globalObject: 'wx' }

  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  ${globalObject}._prerender = inst
}`

  const hmr = !options.hot ? '' : `if (process.env.NODE_ENV !== 'production') {
  const cache = __webpack_require__.c || {}
  Object.keys(cache).forEach(item => {
    if (item.indexOf('${pageName}') !== -1) delete cache[item]
  })
}`

  if (typeof options.loaderMeta.modifyConfig === 'function') {
    options.loaderMeta.modifyConfig(config, source)
  }

  let instantiatePage = `var inst = Page(createPageConfig(component, '${pageName}', {root:{cn:[]}}, config || {}))`

  // 上面保留的instantiatePage是为了避免影响存在modifyInstantiate的平台
  if (process.env.TARO_PLATFORM === PLATFORM_TYPE.MINI) {
    instantiatePage = `
var taroOption = createPageConfig(component, '${pageName}', {root:{cn:[]}}, config || {})
if (component && component.behaviors) {
  taroOption.${behaviorsName} = (taroOption.${behaviorsName} || []).concat(component.behaviors)
}
${options.sharedRuntime ? `
// 共享运行时（方案二 split）多包 App 隔离:每次进入本页面前,把 Current.app 切回本业务包
// 的 realApp,避免 A→B→A 跨包切换后 A 页面 mount 到 B 的 App 上。
// 从 shared.__pkgApps[pkgId] 表查回本包 App,pkgApps 由 app-shim/async-provider 存;
// 若未激活/表空,不切换(fallback 到 last-writer 语义,与首次冷启动直达 A 页语义一致)。
if (typeof ${globalObject}[${JSON.stringify(options.sharedRuntimeGlobalKey)}] !== 'undefined') {
  var __TARO_SHARED_FOR_PAGE__ = ${globalObject}[${JSON.stringify(options.sharedRuntimeGlobalKey)}]
  var __TARO_PKG_ID_FOR_PAGE__ = ${JSON.stringify(options.sharedRuntimePkgId)}
  var __TARO_ORIGINAL_ONLOAD__ = taroOption.onLoad
  taroOption.onLoad = function () {
    var __pkgApps = __TARO_SHARED_FOR_PAGE__.__pkgApps || {}
    var __runtime = __TARO_SHARED_FOR_PAGE__['@tarojs/runtime']
    var __myApp = __pkgApps[__TARO_PKG_ID_FOR_PAGE__]
    if (__myApp && __runtime && __runtime.Current) {
      __runtime.Current.app = __myApp
    }
    return __TARO_ORIGINAL_ONLOAD__.apply(this, arguments)
  }
}
` : ''}
var inst = Page(taroOption)
`
  }

  if (typeof modifyInstantiate === 'function') {
    instantiatePage = modifyInstantiate(instantiatePage, 'page')
  }

  return `import { createPageConfig } from '@tarojs/runtime'
import component from ${stringify(componentPath)}
var config = ${configString};
${config.enableShareTimeline ? 'component.enableShareTimeline = true' : ''}
${config.enableShareAppMessage ? 'component.enableShareAppMessage = true' : ''}
${instantiatePage}
${options.prerender ? prerender : ''}
${hmr}
export default component
`
}

export function getPageConfig (configs: Record<string, PageConfig>, resourcePath: string) {
  const configPath = removeExt(resourcePath) + '.config'
  for (const name in configs) {
    const config = configs[name]
    const currentPath = config.path.endsWith('.config') ? config.path : removeExt(config.path)
    if (currentPath === configPath) {
      return config.content
    }
  }
  return {}
}

function removeExt (file: string) {
  return path.join(path.dirname(file), path.basename(file, path.extname(file)))
}
