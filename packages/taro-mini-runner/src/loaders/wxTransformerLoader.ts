import { getOptions } from 'loader-utils'
import * as wxTransformer from '@tarojs/transformer-wx'

import { REG_TYPESCRIPT } from '../utils/constants'

export default function wxTransformerLoader (source) {
  const options = getOptions(this)
  const filePath = this.resourcePath
  const { buildAdapter } = options
  const transformResult = wxTransformer({
    code: source,
    sourcePath: filePath,
    isTyped: REG_TYPESCRIPT.test(filePath),
    adapter: buildAdapter
  })
  this.callback(null, transformResult.code, transformResult.ast)
  console.log('wxTransformerLoader')
  return transformResult.code
}
