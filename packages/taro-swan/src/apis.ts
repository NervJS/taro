import { processApis } from '@tarojs/shared'
import { noPromiseApis, needPromiseApis } from './apis-list'

declare const swan: any

export function initNativeApi (taro) {
  processApis(taro, swan, {
    noPromiseApis,
    needPromiseApis
  })
}
