import * as webpack from 'webpack'
import { getOptions, stringifyRequest } from 'loader-utils'
import { normalizePath } from '@tarojs/helper'
import * as path from 'path'
import { frameworkMeta } from './utils'

interface PageConfig {
  content: any
  path: string
}

export default function (this: webpack.loader.LoaderContext) {
  const options = getOptions(this)
  const config = getPageConfig(options.config, this.resourcePath)
  const configString = JSON.stringify(config)
  const stringify = (s: string): string => stringifyRequest(this, s)
  const { isNeedRawLoader } = frameworkMeta[options.framework]
  // raw is a placeholder loader to locate changed .vue resource
  const raw = path.join(__dirname, 'raw.js')
  const loaders = this.loaders
  const thisLoaderIndex = loaders.findIndex(item => normalizePath(item.path).indexOf('@tarojs/taro-loader/lib/page') >= 0)
  const componentPath = isNeedRawLoader
    ? `${raw}!${this.resourcePath}`
    : this.request.split('!').slice(thisLoaderIndex + 1).join('!')
  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  global._prerender = inst
}`
  return `import { createPageConfig } from '@tarojs/runtime'
import component from ${stringify(componentPath)}
var config = ${configString};
${config.enableShareTimeline ? 'component.enableShareTimeline = true' : ''}
${config.enableShareAppMessage ? 'component.enableShareAppMessage = true' : ''}
var inst = Page(createPageConfig(component, '${options.name}', {root:{cn:[]}}, config || {}))
${options.prerender ? prerender : ''}
`
}

function getPageConfig (configs: Record<string, PageConfig>, resourcePath: string) {
  const configPath = removeExt(resourcePath) + '.config'
  for (const name in configs) {
    const config = configs[name]
    if (removeExt(configs[name].path) === configPath) {
      return config.content
    }
  }
  return {}
}

function removeExt (file: string) {
  return path.join(path.dirname(file), path.basename(file, path.extname(file)))
}
