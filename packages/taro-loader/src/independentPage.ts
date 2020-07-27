import * as webpack from 'webpack'
import { getOptions, stringifyRequest } from 'loader-utils'
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
  const {
    isNeedRawLoader,
    importFrameworkStatement,
    mockAppStatement,
    frameworkArgs,
    creator
  } = frameworkMeta[options.framework]
  const appConfig = options.appConfig
  const frameworkArgsArray = frameworkArgs.split(',')
  frameworkArgsArray.splice(frameworkArgsArray.length - 1, 1, 'appConfig')
  const frameworkArgsCopy = frameworkArgsArray.join(',')
  // raw is a placeholder loader to locate changed .vue resource
  const raw = path.join(__dirname, 'raw.js')
  const componentPath = isNeedRawLoader
    ? `${raw}!${this.resourcePath}`
    : this.request.split('!').slice(1).join('!')
  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  global._prerender = inst
}`
  return `import { createPageConfig, createReactApp } from '@tarojs/runtime'
import component from ${stringify(componentPath)}
${importFrameworkStatement}
var config = ${configString};
var appConfig = ${JSON.stringify(appConfig)};
${mockAppStatement}
${creator}(App, ${frameworkArgsCopy})
${config.enableShareTimeline ? 'component.enableShareTimeline = true' : ''}
${config.enableShareAppMessage ? 'component.enableShareAppMessage = true' : ''}
var inst = Page(createPageConfig(component, '${options.name}', {}, config || {}))
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
