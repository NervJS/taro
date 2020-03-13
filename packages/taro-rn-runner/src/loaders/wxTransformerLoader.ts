import { getOptions } from 'loader-utils'
import wxTransformer from '@tarojs/transformer-wx'

import { REG_TYPESCRIPT } from '../utils/constants'

export default function wxTransformerLoader (source) {
  const {buildAdapter} = getOptions(this)
  const filePath = this.resourcePath
  try {
    const wxTransformerParams: any = {
      code: source,
      sourcePath: filePath,
      isTyped: REG_TYPESCRIPT.test(filePath),
      adapter: buildAdapter,
      isNormal: true
    }
    const transformResult = wxTransformer(wxTransformerParams)
    this.callback(null, transformResult.code, transformResult.ast)
    // console.log('wxTransformerLoader', transformResult.code)
    return transformResult.code
  } catch (error) {
    this.emitError(error)
    this.callback(null, source, null)
    return source
  }
}
