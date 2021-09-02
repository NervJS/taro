import AsyncStorage from '@react-native-async-storage/async-storage'
import { errorHandler, successHandler } from '../../utils'

export async function getStorage(option: Taro.getStorage.Option<any>): Promise<Taro.getStorage.SuccessCallbackResult<any>> {
  const { key, success, fail, complete } = option
  const res = { errMsg: 'getStorage:ok' }

  try {
    const data = await AsyncStorage.getItem(key)
    if (data) {
      const result = {
        data: JSON.parse(data),
        ...res
      }
      return successHandler(success, complete)(result)
    } else {
      res.errMsg = 'getStorage:fail data not found'
      return errorHandler(fail, complete)(res)
    }
  } catch (err) {
    res.errMsg = err.message
    return errorHandler(fail, complete)(res)
  }
}
