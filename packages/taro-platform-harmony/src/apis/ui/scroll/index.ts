/**
 * 鸿蒙SDK API Version 6
 * 将页面滚动到目标位置
 * - 支持选择器（只支持id选择器和 class 选择器，暂不支持子选择器、后代选择器、跨自定义组件选择器、多选择器并集）
 * - 滚动距离
 * 文档地址 https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-framework-syntax-js-0000000000611432
 */
import { AREA_CHANGE_EVENT_NAME, Current, findChildNodeWithDFS, getPageScrollerOrNode, setNodeEventCallbackAndTriggerComponentUpdate } from '@tarojs/runtime'
import { pxTransformHelper } from '@tarojs/taro'

import { MethodHandler } from '../../utils/handler'

import type Taro from '@tarojs/taro/types'

/**
 * 将页面滚动到目标位置
 */
export const pageScrollTo: typeof Taro.pageScrollTo = (options) => {
  const { scrollTop, selector = '', duration = 300, offsetTop = 0, success, fail, complete } = options || {}
  const handle = new MethodHandler({ name: 'pageScrollTo', success, fail, complete })
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    if (scrollTop === undefined && !selector) {
      return handle.fail({
        errMsg: 'scrollTop" 或 "selector" 需要其之一'
      }, { resolve, reject })
    }

    if (scrollTop && selector) {
      console.warn('"scrollTop" 或 "selector" 建议只设一个值，全部设置会忽略selector')
    }

    const taro = (Current as any).taro
    const page = taro.getCurrentInstance().page

    let scrollValue = -1
    let scroller = getPageScrollerOrNode(page?.scroller, page)
    const currentPageNode = getPageScrollerOrNode(page?.node, page)

    if (scrollTop || typeof scrollTop === 'number') {
      scrollValue = scrollTop
    } else if (selector) {
      const node = findChildNodeWithDFS(currentPageNode, selector)

      if (!node) return

      // 获取 areaInfo，需要先调用 setNodeEventCallbackAndTriggerComponentUpdate 更新一次组件并获取组件信息
      await setNodeEventCallbackAndTriggerComponentUpdate(node, AREA_CHANGE_EVENT_NAME, null, true)

      const { areaInfo } = node._nodeInfo || {}

      let parent = node?.parentNode
      while (!!parent && parent !== currentPageNode) {
        if (parent?.scroller) {
          scroller = parent.scroller
          break
        }
        parent = parent?.parentNode
      }

      scroller = getPageScrollerOrNode(scroller, page)

      const { yOffset } = scroller.currentOffset()

      if (areaInfo) {
        scrollValue = areaInfo.globalPosition.y + yOffset + pxTransformHelper(offsetTop, 'px', true)
      }
    }
    if (!scroller || scrollValue === -1) {
      return handle.fail({
        errMsg: '请检查传入的 scrollTop 或 selector 是否合法'
      }, { resolve, reject })
    }

    const { xOffset } = scroller.currentOffset()

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
        handle.success({}, { resolve, reject })
      }, duration)
    } catch (err) {
      return handle.fail({
        errMsg: err.message
      }, { resolve, reject })
    }
  })
}
