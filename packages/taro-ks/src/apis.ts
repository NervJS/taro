import { processApis } from '@tarojs/shared'

declare const ks: any
export function initNativeApi (taro) {
  processApis(taro, ks, {
  })
}
