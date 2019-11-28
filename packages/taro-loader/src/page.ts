import * as webpack from 'webpack'
import { getOptions } from 'loader-utils'
import * as path from 'path'

export default function (this: webpack.loader.LoaderContext) {
  const options = getOptions(this)
  // raw is a placeholder loader to locate changed .vue resource
  const raw = path.join(__dirname, 'raw.js')
  const componentPath = options.framework === 'vue'
    ? `${raw}!${this.resourcePath}`
    : this.request.split('!').slice(1).join('!')
  return `import { createPageConfig } from '@tarojs/runtime'
import component from '${componentPath}'
Page(createPageConfig(component))
`
}
