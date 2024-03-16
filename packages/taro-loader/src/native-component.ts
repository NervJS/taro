import { getOptions, stringifyRequest } from 'loader-utils'
import * as path from 'path'

import { entryCache } from './entry-cache'
import { getPageConfig } from './page'

import type * as webpack from 'webpack'

export default function (this: webpack.LoaderContext<any>, source: string) {
  const options = getOptions(this)
  const { loaderMeta = {}, config: loaderConfig, isNewBlended = false, runtimePath  } = options
  const { importFrameworkStatement, frameworkArgs, isNeedRawLoader, creatorLocation } = loaderMeta
  const config = getPageConfig(loaderConfig, this.resourcePath)
  config.isNewBlended = isNewBlended
  const configString = JSON.stringify(config)
  const stringify = (s: string): string => stringifyRequest(this, s)
  const pageName = options.name
  // raw is a placeholder loader to locate changed .vue resource
  const entryCacheLoader = path.join(__dirname, 'entry-cache.js') + `?name=${pageName}`
  entryCache.set(pageName, source)
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
var inst = Component(createNativeComponentConfig(component, ${frameworkArgs}))
${options.prerender ? prerender : ''}
export default component
`
}
