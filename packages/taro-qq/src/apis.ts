import { processApis } from '@tarojs/shared'
import {
  needPromiseApis
} from '@tarojs/plugin-platform-weapp/dist/runtime-utils'

declare const qq: any

const asyncApis = new Set([
  'getQQRunData',
  'requestWxPayment',
  'setAvatar',
  'shareInvite',
  'updateBookshelfReadTime'
])

export function initNativeApi (taro) {
  processApis(taro, qq, {
    needPromiseApis: new Set([...needPromiseApis, ...asyncApis])
  })
  taro.cloud = qq.cloud
}
