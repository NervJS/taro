import { normalizePath } from '@tarojs/helper'
import { getOptions, stringifyRequest } from 'loader-utils'
import * as path from 'path'

import type * as webpack from 'webpack'

export default function (this: webpack.LoaderContext<any>) {
  const options = getOptions(this)
  const stringify = (s: string): string => stringifyRequest(this, s)
  const { isNeedRawLoader } = options.loaderMeta
  // raw is a placeholder loader to locate changed .vue resource
  const raw = path.join(__dirname, 'raw.js')
  const loaders = this.loaders
  const thisLoaderIndex = loaders.findIndex(item => normalizePath(item.path).indexOf('@tarojs/taro-loader/lib/component') >= 0)
  const componentPath = isNeedRawLoader
    ? `${raw}!${this.resourcePath}`
    : this.request.split('!').slice(thisLoaderIndex + 1).join('!')
  const { globalObject } = this._compilation?.outputOptions || { globalObject: 'wx' }

  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  ${globalObject}._prerender = inst
}`
  return `import { createComponentConfig } from '@tarojs/runtime'
import component from ${stringify(componentPath)}
var inst = Component(createComponentConfig(component, '${options.name}'))
${options.prerender ? prerender : ''}
export default component
`
}
