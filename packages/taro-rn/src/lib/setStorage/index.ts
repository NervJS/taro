import AsyncStorage from '@react-native-async-storage/async-storage'
import { errorHandler, successHandler } from '../../utils'

export async function setStorage(option: Taro.setStorage.Option): Promise<TaroGeneral.CallbackResult> {
  const { key, data, success, fail, complete } = option
  const res = { errMsg: 'setStorage:ok' }

  try {
    await AsyncStorage.setItem(key, JSON.stringify(data))
    return successHandler(success, complete)(res)
  } catch (err) {
    res.errMsg = err.message
    return errorHandler(fail, complete)(res)
  }
}
