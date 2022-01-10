import { Linking } from 'react-native'
import { successHandler, errorHandler } from '../../utils'

export async function makePhoneCall(opts: Taro.makePhoneCall.Option): Promise<TaroGeneral.CallbackResult> {
  const { phoneNumber, success, fail, complete } = opts
  const res = { errMsg: 'makePhoneCall:ok' }
  const telUrl = `tel:${phoneNumber}`

  const isSupport = await Linking.canOpenURL(telUrl)
  if (isSupport) {
    await Linking.openURL(telUrl)
    return successHandler(success, complete)(res)
  } else {
    res.errMsg = 'makePhoneCall:fail. Do not support the makePhoneCall Api'
    return errorHandler(fail, complete)(res)
  }
}
