import { processApis } from '@tarojs/shared'

import { needPromiseApis } from './apis-list'

declare const wx: any

export function initNativeApi (taro) {
  processApis(taro, wx, {
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

  // 保存原始的 navigateTo 方法
  const originalNavigateTo = taro.navigateTo

  // 重写 navigateTo 以支持 Skyline 渲染模式
  taro.navigateTo = function (options: Record<string, any>) {
    // 检查是否在 Skyline 模式下使用了特殊的 routeType
    if (options?.routeType && typeof wx !== 'undefined') {
      // 获取当前渲染器类型
      const renderer = taro.getRenderer?.() || 'webview'

      // Skyline 模式下，routeType 参数需要通过原生 API 直接调用
      // 避免 Taro 运行时的动画处理导致节点查找失败
      if (renderer === 'skyline') {
        return new Promise((resolve, reject) => {
          const { success, fail, complete, ...restOptions } = options
          wx.navigateTo({
            ...restOptions,
            success: (res) => {
              success?.(res)
              resolve(res)
            },
            fail: (err) => {
              fail?.(err)
              reject(err)
            },
            complete
          })
        })
      }
    }

    // 非 Skyline 模式或无 routeType 参数时使用标准流程
    return originalNavigateTo.call(taro, options)
  }

  taro.cloud = wx.cloud
  taro.getTabBar = function (pageCtx) {
    if (typeof pageCtx?.getTabBar === 'function') {
      return pageCtx.getTabBar()?.$taroInstances
    }
  }
  taro.getRenderer = function () {
    return taro.getCurrentInstance()?.page?.renderer ?? 'webview'
  }
}
