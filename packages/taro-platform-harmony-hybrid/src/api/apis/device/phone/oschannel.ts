import Taro from '@tarojs/api'

let call

try {
  call = requireNapi('telephony.call')
} catch (e) {} // eslint-disable-line no-empty

const ErrorCode = {
  PARAMETER_ERROR: 202,
}

export const makePhoneCall: typeof Taro.makePhoneCall = (options) => {
  const { phoneNumber, success, fail } = options
  if (!phoneNumber) {
    return new Promise((_resolve, reject) => {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject(['param is invalid.', ErrorCode.PARAMETER_ERROR])
    })
  }
  return call.makeCall(phoneNumber).then(
    () => {
      // @ts-ignore
      success({ errMsg: 'ok' })
    },
    (err: any) => {
      console.error(`[OsChannel] start makePhoneCall fail`)
      // @ts-ignore
      fail({ errMsg: JSON.stringify(err) })
    }
  )
}
