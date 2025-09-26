import { processApis } from '@tarojs/shared'

import { needPromiseApis } from './apis-list'
import { reflectApis } from './reflect-apis'

declare const has: any

export function initNativeApi (taro) {
  processApis(taro, has, {
    needPromiseApis,
    modifyApis (apis) {
      // fix https://github.com/NervJS/taro/issues/9899
      apis.delete('lanDebug')
    },
    transformMeta (api: string, options: Record<string, any>) {
      if (api === 'showShareMenu') {
        options.menus = options.showShareItems?.map(item => item === 'wechatFriends' ? 'shareAppMessage' : item === 'wechatMoment' ? 'shareTimeline' : item)
      }

      return {
        key: api,
        options
      }
    }
  })
  taro.cloud = has.cloud
  taro.getTabBar = function (pageCtx) {
    if (typeof pageCtx?.getTabBar === 'function') {
      return pageCtx.getTabBar()?.$taroInstances
    }
  }
  reflectApis(taro, has)
}
