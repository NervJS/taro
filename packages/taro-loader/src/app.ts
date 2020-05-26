import * as webpack from 'webpack'
import { getOptions, stringifyRequest } from 'loader-utils'
import { importFramework, getFrameworkArgs } from './utils'

export default function (this: webpack.loader.LoaderContext) {
  const stringify = (s: string): string => stringifyRequest(this, s)

  const options = getOptions(this)
  const method = options.framework === 'vue' ? 'createVueApp' : 'createReactApp'
  const config = JSON.stringify(options.config)
  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  global._prerender = inst
}`
  return `import { ${method}, window } from '@tarojs/runtime'
import component from ${stringify(this.request.split('!').slice(1).join('!'))}
${importFramework(options.framework)}
var config = ${config};
window.__taroAppConfig = config
var inst = App(${method}(component, ${getFrameworkArgs(options.framework)}))
${options.prerender ? prerender : ''}
`
}
