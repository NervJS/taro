import { processApis } from '@tarojs/shared'
// import { needPromiseApis } from './apis-list'

declare const xhs: any

export function initNativeApi (taro) {
  processApis(taro, xhs, {

  })
}
