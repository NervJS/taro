import { processApis } from '@tarojs/shared'
import { noPromiseApis, needPromiseApis } from './apis-list'

declare const wx: any

export function initNativeApi (taro) {
  // 下文将详细介绍 processApis 函数
  processApis(taro, wx, {
    noPromiseApis,
    needPromiseApis
  })
  // 可以为 taro 挂载任意的 API
  taro.cloud = wx.cloud
}
