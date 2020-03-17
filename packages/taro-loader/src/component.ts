import * as path from 'path'

import * as webpack from 'webpack'
import { getOptions, stringifyRequest } from 'loader-utils'

export default function (this: webpack.loader.LoaderContext) {
  const options = getOptions(this)
  const stringify = (s: string): string => stringifyRequest(this, s)
  let componentPath = options.framework === 'vue'
    ? `${this.resourcePath}`
    : this.request.split('!').slice(1).join('!')

  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  global._prerender = inst
}`
  componentPath = componentPath.replace(path.basename(componentPath), options.oriFile)
  return `import { createComponentConfig } from '@tarojs/runtime'
import component from ${stringify(componentPath)}
var inst = Component(createComponentConfig(component, '${options.name}'))
${options.prerender ? prerender : ''}
`
}
