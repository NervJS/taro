import { getOptions } from 'loader-utils'
import wxTransformer from '@tarojs/transformer-wx'

import { REG_TYPESCRIPT, PARSE_AST_TYPE } from '../utils/constants'

export default function wxTransformerLoader (source) {
  const { buildAdapter, fileTypeMap } = getOptions(this)
  const filePath = this.resourcePath
  const wxTransformerParams: any = {
    code: source,
    sourcePath: filePath,
    isTyped: REG_TYPESCRIPT.test(filePath),
    adapter: buildAdapter
  }
  if (fileTypeMap[filePath]) {
    const fileType = fileTypeMap[filePath].type
    if (fileType === PARSE_AST_TYPE.ENTRY) {
      wxTransformerParams.isApp = true
    } else if (fileType === PARSE_AST_TYPE.PAGE) {
      wxTransformerParams.isRoot = true
    }
  }
  const transformResult = wxTransformer(wxTransformerParams)
  this.callback(null, transformResult.code, transformResult.ast)
  return transformResult.code
}
