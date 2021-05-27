import { processApis } from '@tarojs/shared'
import { needPromiseApis } from './apis-list'

declare const wx: any

export function initNativeApi (taro) {
  processApis(taro, wx, {
    needPromiseApis
  })
  taro.cloud = wx.cloud
}
