import * as path from 'node:path'

import { entryCache } from './entry-cache'
import { getPageConfig } from './page'
import { stringifyRequest } from './util'

import type * as webpack from 'webpack'

export default function (this: webpack.LoaderContext<any>, source: string) {
  const options = this.getOptions()
  const { importFrameworkStatement, frameworkArgs, isNeedRawLoader, creatorLocation } = options.loaderMeta
  const { config: loaderConfig } = options
  const config = getPageConfig(loaderConfig, this.resourcePath)
  const configString = JSON.stringify(config)
  const stringify = (s: string): string => stringifyRequest(this, s)
  const pageName = options.name
  const behaviorsName = options.behaviorsName
  // raw is a placeholder loader to locate changed .vue resource
  const entryCacheLoader = path.join(__dirname, 'entry-cache.js') + `?name=${pageName}`
  entryCache.set(pageName, source)
  const raw = path.join(__dirname, 'raw.js')
  const componentPath = isNeedRawLoader
    ? ['!', raw, entryCacheLoader, this.resourcePath].join('!')
    : ['!', entryCacheLoader, this.resourcePath].join('!')
  const runtimePath = Array.isArray(options.runtimePath) ? options.runtimePath : [options.runtimePath]
  const setReconciler = runtimePath.reduce((res, item) => {
    if (/^@tarojs\/plugin-(react|vue)-devtools/.test(item)) return res
    return res + `import '${item}'\n`
  }, '')
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

  return `${setReconciler}
import { createNativePageConfig } from '${creatorLocation}'
${importFrameworkStatement}
var component = require(${stringify(componentPath)}).default
var config = ${configString};
${config.enableShareTimeline ? 'component.enableShareTimeline = true' : ''}
${config.enableShareAppMessage ? 'component.enableShareAppMessage = true' : ''}
var taroOption = createNativePageConfig(component, '${pageName}', {root:{cn:[]}}, ${frameworkArgs})
if (component && component.behaviors) {
  taroOption.${behaviorsName} = (taroOption.${behaviorsName} || []).concat(component.behaviors)
}
var inst = Page(taroOption)
${options.prerender ? prerender : ''}
${hmr}
`
}
