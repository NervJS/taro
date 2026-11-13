import Taro from '@tarojs/api'

import { createDownload, shouldBeObject } from '../../utils'
import { MethodHandler } from '../../utils/handler'

export const saveFileToDisk: typeof Taro.saveFileToDisk = async options => {
  const name = 'saveFileToDisk'
  const validation = shouldBeObject(options)
  if (!validation.flag) return new MethodHandler({ name }).fail({ errMsg: validation.msg })

  const { filePath, success, fail, complete } = options
  const handler = new MethodHandler({ name, success, fail, complete })
  if (typeof filePath !== 'string' || !filePath.trim()) {
    return handler.fail({ errMsg: 'filePath must be a non-empty string' })
  }

  try {
    const url = new URL(filePath, document.baseURI)
    if (url.protocol !== 'blob:' &&
      ((url.protocol !== 'http:' && url.protocol !== 'https:') || url.origin !== window.location.origin)) {
      throw new Error('filePath must be a same-origin HTTP(S) URL or a Blob URL')
    }
    createDownload(url.href)
  } catch (error) {
    return handler.fail({ errMsg: error instanceof Error ? error.message : String(error) })
  }
  return handler.success()
}
