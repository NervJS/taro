import AsyncStorage from '@react-native-async-storage/async-storage'

export function setStorage(option: Taro.setStorage.Option): Promise<Taro.General.CallbackResult> {
  const { key, data, success, fail, complete } = option
  const res = { errMsg: 'setStorage:ok' }

  return new Promise((resolve, reject) => {
    AsyncStorage.setItem(key, JSON.stringify(data))
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
