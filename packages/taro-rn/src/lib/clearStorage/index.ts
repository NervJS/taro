import AsyncStorage from '@react-native-async-storage/async-storage'

export function clearStorage(option: Taro.clearStorage.Option = {}): Promise<Taro.General.CallbackResult> {
  const { success, fail, complete } = option
  const res = { errMsg: 'clearStorage:ok' }

  return new Promise((resolve, reject) => {
    AsyncStorage.clear()
      .then(() => {
        success?.(res)
        complete?.(res)

        resolve(res)
      }).catch((err) => {
        res.errMsg = err.message
        fail?.(res)
        complete?.(res)

        reject(err)
      })
  })
}
