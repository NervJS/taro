// @ts-nocheck
/**
 * 鸿蒙SDK API Version 6
 * 将页面滚动到目标位置
 * - 支持选择器（只支持id选择器和 class 选择器，暂不支持子选择器、后代选择器、跨自定义组件选择器、多选择器并集）
 * - 滚动距离
 * 文档地址 https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-framework-syntax-js-0000000000611432
 */
import { AREA_CHANGE_EVENT_NAME, Current, getPageScrollerOrNode, setNodeEventCallbackAndTriggerComponentUpdate } from '@tarojs/runtime'

import { callAsyncFail, callAsyncSuccess, findChildNodeWithDFS } from '../utils'

import type Taro from '@tarojs/taro'

type pageScrollTo = typeof Taro.pageScrollTo

// TODO
export const getCurrentPages = () => []

export const pageScrollTo: pageScrollTo = (options) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const taro = (Current as any).taro
    const page = taro.getCurrentInstance().page
    const res = { errMsg: 'pageScrollTo:ok' }
    const error = { errMsg: 'pageScrollTo:fail' }
    const { scrollTop, selector = '', duration = 300, offsetTop = 0 } = options

    if (scrollTop && selector) {
      console.warn('"scrollTop" 或 "selector" 建议只设一个值，全部设置会忽略selector')
    }

    let scrollValue = -1
    let scroller = page.scroller
    const currentPageNode = getPageScrollerOrNode(page.node, page)

    if (scrollTop || typeof scrollTop === 'number') {
      scrollValue = scrollTop
    } else if (selector) {
      const node = findChildNodeWithDFS(currentPageNode, selector)

      if (!node || !node._instance) return

      const instance = node._instance
      const id = node?._nid

      // 获取 areaInfo，需要先调用 setNodeEventCallbackAndTriggerComponentUpdate 更新一次组件并获取组件信息
      await setNodeEventCallbackAndTriggerComponentUpdate(node, AREA_CHANGE_EVENT_NAME, null, true)

      const { areaInfo } = instance?.nodeInfoMap?.[id] || {}

      let parent = node?.parentNode
      while (!!parent && parent !== currentPageNode) {
        if (parent?._instance?.scroller) {
          scroller = parent._instance.scroller
          break
        }
        parent = parent?.parentNode
      }

      scroller = getPageScrollerOrNode(scroller, page)

      const { yOffset } = scroller.currentOffset()

      if (areaInfo) {
        scrollValue = areaInfo.globalPosition.y + yOffset + offsetTop
      }
    }
    const { xOffset } = scroller.currentOffset()

    if (scrollValue === -1) {
      return callAsyncFail(reject, { errMsg: 'pageScrollTo:fail, 请检查传入的 scrollTop 或 selector 是否合法' }, options)
    }

    try {
      scroller.scrollTo({
        xOffset,
        yOffset: scrollValue,
        animation: {
          duration: duration,
          // @ts-ignore
          curve: Curve.Linear
        }
      })

      setTimeout(() => {
        callAsyncSuccess(resolve, res, options)
      }, duration)
    } catch (_) {
      callAsyncFail(reject, error, options)
    }
  })
}
