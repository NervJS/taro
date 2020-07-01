import * as webpack from 'webpack'
import { getOptions, stringifyRequest } from 'loader-utils'
import * as path from 'path'
import { frameworkMeta } from './utils'

export default function (this: webpack.loader.LoaderContext) {
  const options = getOptions(this)
  const stringify = (s: string): string => stringifyRequest(this, s)
  const { isNeedRawLoader } = frameworkMeta[options.framework]
  // raw is a placeholder loader to locate changed .vue resource
  const raw = path.join(__dirname, 'raw.js')
  const componentPath = isNeedRawLoader
    ? `${raw}!${this.resourcePath}`
    : this.request.split('!').slice(1).join('!')
  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  global._prerender = inst
}`
  return `import { createComponentConfig } from '@tarojs/runtime'
import component from ${stringify(componentPath)}
var inst = Component(createComponentConfig(component, '${options.name}'))
${options.prerender ? prerender : ''}
`
}
