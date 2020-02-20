import * as webpack from 'webpack'
import { getOptions } from 'loader-utils'
import { AppConfig, PageConfig } from '@tarojs/taro'
import { join, dirname } from 'path'

function genResource (path: string, pages: Record<string, PageConfig>, { context }: webpack.loader.LoaderContext) {
  return `
  Object.assign({
      path: '${path}',
      load: () => {
          return import('${join(context, path)}')
      }
  }, ${JSON.stringify(pages[path])} || {}),
`
}

export default function (this: webpack.loader.LoaderContext) {
  const options = getOptions(this)
  const config: AppConfig = options.config
  const pages: Record<string, PageConfig> = options.pages
  const code = `import { createRouter } from '@tarojs/router'
import component from '${join(dirname(this.resourcePath), 'app')}'
const config = ${JSON.stringify(config)}
config.routes = [
  ${config.pages?.map(path => genResource(path, pages, this)).join('')}
]
createRouter(component, config, '${options.framework}')
`

  return code
}
