import Taro from '@tarojs/taro'

import { hideKeyboard as nativeHideKeyboard } from './native'
import { hideKeyboard as osChannelHideKeyboard } from './oschannel'


export const hideKeyboard: typeof Taro.hideKeyboard = (options, useNativeImpl: boolean = false) => {
  return useNativeImpl ? nativeHideKeyboard(options) : osChannelHideKeyboard(options)
}
