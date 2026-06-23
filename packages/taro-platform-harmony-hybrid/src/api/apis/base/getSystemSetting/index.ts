import Taro from '@tarojs/api'

import { getSystemSetting as nativeGetSystemSetting } from './native'
import { getSystemSetting as osChannelGetSystemSetting } from './oschannel'

export const getSystemSetting: typeof Taro.getSystemSetting = (useNativeImpl: boolean = true) => {
  return useNativeImpl ? nativeGetSystemSetting() : osChannelGetSystemSetting()
}
