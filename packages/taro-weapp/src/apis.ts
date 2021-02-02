import { processApis } from '@tarojs/shared'
import { noPromiseApis, needPromiseApis } from './apis-list'

declare const wx: any

export function initNativeApi (taro) {
  processApis(taro, wx, {
    noPromiseApis,
    needPromiseApis
  })
  taro.cloud = wx.cloud
}
