import { Linking } from 'react-native'
import { successHandler, errorHandler } from '../../utils'

export async function openUrl <T>(opts: Taro.OpenUrl.Option): Promise<T> {
  const { url, success, fail, complete } = opts || {} as Taro.OpenUrl.Option
  const res: any = { errMsg: 'openUrl:ok' }

  const isSupport = await Linking.canOpenURL(url)
  if (isSupport) {
    await Linking.openURL(url)
    return successHandler(success, complete)(res)
  } else {
    res.errMsg = 'openUrl:fail. Do not support the openUrl Api'
    return errorHandler(fail, complete)(res)
  }
}

export default {
  openUrl
}
