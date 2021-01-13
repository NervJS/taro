import { Linking } from 'react-native'

export async function openUrl <T>(opts: Taro.OpenUrl.Option): Promise<T> {
  const { url, success, fail, complete } = opts || {} as Taro.OpenUrl.Option
  const res: any = { errMsg: 'openUrl:ok' }

  const isSupport = await Linking.canOpenURL(url)
  if (isSupport) {
    await Linking.openURL(url)
    success && success(res)
    complete && complete(res)

    return Promise.resolve(res)
  } else {
    res.errMsg = 'openUrl:fail. Do not support the openUrl Api'
    fail && fail(res)
    complete && complete(res)

    return Promise.reject(res)
  }
}

export default {
  openUrl
}
