import { getOptions } from 'loader-utils'
import * as wxTransformer from '@tarojs/transformer-wx'

import { REG_TYPESCRIPT } from '../utils/constants'
import { TARO_FILE_TYPE } from '../plugins/miniPlugin'

export default function wxTransformerLoader (source) {
  const { buildAdapter, fileTypeMap } = getOptions(this)
  const filePath = this.resourcePath
  const wxTransformerParams: any = {
    code: source,
    sourcePath: filePath,
    isTyped: REG_TYPESCRIPT.test(filePath),
    adapter: buildAdapter
  }
  if (fileTypeMap[filePath] === TARO_FILE_TYPE.APP) {
    wxTransformerParams.isApp = true
  } else if (fileTypeMap[filePath] === TARO_FILE_TYPE.PAGE) {
    wxTransformerParams.isRoot = true
  }
  const transformResult = wxTransformer(wxTransformerParams)
  this.callback(null, transformResult.code, transformResult.ast)
  return transformResult.code
}
