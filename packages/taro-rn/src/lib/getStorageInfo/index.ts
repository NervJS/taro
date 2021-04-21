import AsyncStorage from '@react-native-async-storage/async-storage'

async function getStorageCurrentSize() {
  const keys = await AsyncStorage.getAllKeys()
  const mults = await AsyncStorage.multiGet(keys)
  const size = mults.reduce((prev, current) => {
    const sum = prev + (current && current[1] ? current[1].length : 0)
    return sum
  }, 0)
  return Number((size / 1024).toFixed(2))
}

export function getStorageInfo(option: Taro.getStorageInfo.Option = {}): Promise<Taro.General.CallbackResult> {
  const { success, fail, complete } = option
  const res = { errMsg: 'getStorageInfo:ok' }

  return new Promise((resolve, reject) => {
    AsyncStorage.getAllKeys()
      .then(async (data) => {
        const result = {
          ...res,
          keys: data,
          currentSize: await getStorageCurrentSize(),
          limitSize: Infinity
        }
        success && success(result)
        complete && complete(result)

        resolve(result)
      }).catch((err) => {
        res.errMsg = err.message
        fail && fail(res)
        complete && complete(res)

        reject(err)
      })
  })
}
