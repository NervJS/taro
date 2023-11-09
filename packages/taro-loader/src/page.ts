import { getOptions, stringifyRequest } from 'loader-utils'
import * as path from 'path'

import { entryCache } from './entry-cache'

import type * as webpack from 'webpack'

interface PageConfig {
  content: any
  path: string
}

export default function (this: webpack.LoaderContext<any>, source: string) {
  const options = getOptions(this)
  const { config: loaderConfig } = options
  const config = getPageConfig(loaderConfig, this.resourcePath)
  const configString = JSON.stringify(config)
  const stringify = (s: string): string => stringifyRequest(this, s)
  const pageName = options.name
  const { isNeedRawLoader, modifyInstantiate } = options.loaderMeta
  // raw is a placeholder loader to locate changed .vue resource
  const entryCacheLoader = path.join(__dirname, 'entry-cache.js') + `?name=${pageName}`
  entryCache.set(pageName, source)
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
