import AsyncStorage from '@react-native-async-storage/async-storage'
import { errorHandler, successHandler } from '../../utils'

async function getStorageCurrentSize() {
  const keys = await AsyncStorage.getAllKeys()
  const mults = await AsyncStorage.multiGet(keys)
  const size = mults.reduce((prev, current) => {
    const sum = prev + (current && current[1] ? current[1].length : 0)
    return sum
  }, 0)
  return Number((size / 1024).toFixed(2))
}

export async function getStorageInfo(option: Taro.getStorageInfo.Option = {}): Promise<TaroGeneral.CallbackResult> {
  const { success, fail, complete } = option
  const res = { errMsg: 'getStorageInfo:ok' }

  try {
    const data = await AsyncStorage.getAllKeys()
    const result = {
      ...res,
      keys: data,
      currentSize: await getStorageCurrentSize(),
      limitSize: Infinity
    }
    // @ts-ignore
    return successHandler(success, complete)(result)
  } catch (err) {
    res.errMsg = err.message
    return errorHandler(fail, complete)(err)
  }
}
