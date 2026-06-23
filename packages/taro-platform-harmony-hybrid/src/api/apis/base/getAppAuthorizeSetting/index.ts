import Taro from '@tarojs/api'

import { getAppAuthorizeSetting as nativeGetAppAuthorizeSetting } from './native'
import { getAppAuthorizeSetting as osChannelGetAppAuthorizeSetting } from './oschannel'

export const getAppAuthorizeSetting: typeof Taro.getAppAuthorizeSetting = (useNativeImpl: boolean = true) => {
  return useNativeImpl ? nativeGetAppAuthorizeSetting() : osChannelGetAppAuthorizeSetting()
}
