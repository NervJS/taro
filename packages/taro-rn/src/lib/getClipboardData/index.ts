import Clipboard from '@react-native-clipboard/clipboard'
import { errorHandler } from '../../utils'

export function getClipboardData (opts: Taro.getClipboardData.Option = {}): Promise<Taro.getClipboardData.Promised> {
  const { success, fail, complete } = opts

  return Clipboard.getString()
    .then((content) => {
      const res = {
        errMsg: 'getClipboardData:ok',
        data: content
      }
      success?.(res)
      complete?.(res)

      return Promise.resolve(res)
    }).catch((err) => {
      const res = {
        errMsg: err.message
      }
      return errorHandler(fail, complete)(res)
    })
}
