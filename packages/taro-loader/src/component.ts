import * as webpack from 'webpack'
import { getOptions, stringifyRequest } from 'loader-utils'
import * as path from 'path'

export default function (this: webpack.loader.LoaderContext) {
  const options = getOptions(this)
  const stringify = (s: string): string => stringifyRequest(this, s)
  // raw is a placeholder loader to locate changed .vue resource
  const raw = path.join(__dirname, 'raw.js')
  const componentPath = options.framework === 'vue' || options.framework === 'vue3'
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
