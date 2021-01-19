import * as webpack from 'webpack'
import { getOptions, stringifyRequest } from 'loader-utils'
import { frameworkMeta } from './utils'

export default function (this: webpack.loader.LoaderContext) {
  const stringify = (s: string): string => stringifyRequest(this, s)

  const options = getOptions(this)
  const { importFrameworkStatement, frameworkArgs, creator } = frameworkMeta[options.framework]
  const config = JSON.stringify(options.config)
  const blended = options.blended

  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  global._prerender = inst
}`

  const createApp = `${creator}(component, ${frameworkArgs})`
  const instantiateApp = blended
    ? `
var opt = ${createApp}
exports.taroApp = opt
`
    : `var inst = App(${createApp})`

  return `import { ${creator}, window } from '@tarojs/runtime'
import component from ${stringify(this.request.split('!').slice(1).join('!'))}
${importFrameworkStatement}
var config = ${config};
window.__taroAppConfig = config
${instantiateApp}
${options.prerender ? prerender : ''}
`
}
