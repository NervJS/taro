import * as webpack from 'webpack'
import { getOptions } from 'loader-utils'

export default function (this: webpack.loader.LoaderContext) {
  const options = getOptions(this)
  const method = options.framework === 'vue' ? 'createVueApp' : 'createReactApp'
  return `import { ${method} } from '@tarojs/runtime'
import component from '${this.request.split('!').slice(1).join('!')}'
App(${method}(component))
`
}
