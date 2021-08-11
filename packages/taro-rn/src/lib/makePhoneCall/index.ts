import { Linking } from 'react-native'

export async function makePhoneCall(opts: Taro.makePhoneCall.Option): Promise<Taro.General.CallbackResult> {
  const { phoneNumber, success, fail, complete } = opts
  const res = { errMsg: 'makePhoneCall:ok' }
  const telUrl = `tel:${phoneNumber}`

  const isSupport = await Linking.canOpenURL(telUrl)
  if (isSupport) {
    await Linking.openURL(telUrl)
    success?.(res)
    complete?.(res)

    return Promise.resolve(res)
  } else {
    res.errMsg = 'makePhoneCall:fail. Do not support the makePhoneCall Api'
    fail?.(res)
    complete?.(res)

    return Promise.reject(res)
  }
}
