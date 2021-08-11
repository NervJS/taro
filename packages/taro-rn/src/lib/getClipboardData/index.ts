import Clipboard from '@react-native-community/clipboard'

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
      fail?.(res)
      complete?.(res)

      return Promise.reject(err)
    })
}
