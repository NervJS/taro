import Taro from '@tarojs/api'

import { makePhoneCall as nativeMakePhoneCall } from './native'
import { makePhoneCall as osChannelMakePhoneCall } from './oschannel'

export const makePhoneCall: typeof Taro.makePhoneCall = (options, useNativeImpl = false) => {
  return useNativeImpl ? nativeMakePhoneCall(options) : osChannelMakePhoneCall(options)
}
