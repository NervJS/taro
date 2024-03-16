import { processApis } from '@tarojs/shared'

declare const jd: any

export function initNativeApi (taro) {
  processApis(taro, jd)
  
  taro.getTabBar = function (pageCtx) {
    if (typeof pageCtx?.getTabBar === 'function') {
      return pageCtx.getTabBar()?.$taroInstances
    }
  }
}
