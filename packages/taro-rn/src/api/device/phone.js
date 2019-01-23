import { Linking } from 'react-native'

export async function makePhoneCall (opts = {}) {
  const { phoneNumber, success, fail, complete } = opts
  const res = { errMsg: 'makePhoneCall:ok' }
  const telUrl = `tel:${phoneNumber}`

  const isSupport = await Linking.canOpenURL(telUrl)
  if (isSupport) {
    await Linking.openURL(telUrl)
    success && success(res)
    complete && complete(res)

    return Promise.resolve(res)
  } else {
    res.errMsg = 'makePhoneCall:fail. Do not support the makePhoneCall Api'
    fail && fail(res)
    complete && complete(res)

    return Promise.reject(res)
  }
}

export default {
  makePhoneCall
}
