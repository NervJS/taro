import { processApis } from '@tarojs/shared'

declare const jd: any

export function initNativeApi (taro) {
  processApis(taro, jd)
}
