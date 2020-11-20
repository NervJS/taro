import AsyncStorage from '@react-native-async-storage/async-storage'

export function getStorage(option: Taro.getStorage.Option<any>): Promise<Taro.getStorage.SuccessCallbackResult<any>> {
  const { key, success, fail, complete } = option
  const res = { errMsg: 'getStorage:ok' }

  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key)
      .then((data) => {
        if (data) {
          const result = {
            data: JSON.parse(data),
            ...res
          }
          success?.(result)
          complete?.(result)

          resolve(result)
        } else {
          res.errMsg = 'getStorage:fail data not found'
          fail?.(res)
          complete?.(res)

          reject(res)
        }
      }).catch((err) => {
        res.errMsg = err.message
        fail?.(res)
        complete?.(res)

        reject(err)
      })
  })
}
