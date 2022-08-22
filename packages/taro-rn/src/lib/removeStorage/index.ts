import AsyncStorage from '@react-native-async-storage/async-storage'

export function removeStorage(option: Taro.removeStorage.Option): Promise<TaroGeneral.CallbackResult> {
  const { key, success, fail, complete } = option
  const res = { errMsg: 'removeStorage:ok' }

  return new Promise((resolve, reject) => {
    AsyncStorage.removeItem(key)
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
