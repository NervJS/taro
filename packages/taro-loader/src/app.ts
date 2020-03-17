import * as path from 'path'

import * as webpack from 'webpack'
import { getOptions, stringifyRequest } from 'loader-utils'

export default function (this: webpack.loader.LoaderContext) {
  const stringify = (s: string): string => stringifyRequest(this, s)

  const options = getOptions(this)
  const method = options.framework === 'vue' ? 'createVueApp' : 'createReactApp'
  let componentPath = this.request.split('!').slice(1).join('!')
  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  global._prerender = inst
}`
componentPath = componentPath.replace(path.basename(componentPath), options.oriFile)
  return `import { ${method} } from '@tarojs/runtime'
import component from ${stringify(componentPath)}
var inst = App(${method}(component))
${options.prerender ? prerender : ''}
`
}
