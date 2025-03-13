import { Current, document } from '@tarojs/runtime'

import { MethodHandler, pxTransformHelper } from '../utils'

import type { TaroAny } from '@tarojs/runtime'
import type Taro from '@tarojs/taro'

export const pageScrollTo: typeof Taro.pageScrollTo = (options) => {
  const { scrollTop, selector = '', duration = 300, offsetTop = 0, success, fail, complete } = options || {}
  const handle = new MethodHandler({ name: 'pageScrollTo', success, fail, complete })
  return new Promise((resolve, reject) => {
    if (scrollTop === undefined && !selector) {
      return handle.fail({
        errMsg: 'scrollTop" 或 "selector" 需要其之一'
      }, { resolve, reject })
    }

    if (scrollTop && selector) {
      console.warn('"scrollTop" 或 "selector" 建议只设一个值, 全部设置会忽略selector')
    }

    const taro = Current.taro
    const page = taro.getCurrentInstance().page

    let scrollTopValue = -1
    let scrollLeftValue = -1
    let scrollNode: TaroAny = null
    const currentPageNode = page?.getPageElement()

    if (scrollTop || typeof scrollTop === 'number') {
      scrollTopValue = scrollTop
    } else if (selector) {
      const node: TaroAny = document.querySelector(selector)

      if (!node) return

      const globalPositionY = node.getComputedStyle().globalY

      let parent = node?.parentNode
      while (!!parent && parent !== currentPageNode) {
        if (parent?.nodeName === 'SCROLL-VIEW') {
          scrollNode = parent
          break
        }
        parent = parent?.parentNode
      }

      if (!scrollNode) return

      // FIXME 更新为新的获取方式获取组件参数
      const result = nativeOtherManager.getCurrentOffset(scrollNode)

      if (!result) return

      const { yOffset, xOffset } = result
      scrollTopValue = globalPositionY + yOffset + pxTransformHelper(offsetTop, 'px', true)
      scrollLeftValue = xOffset
    }

    if (scrollTopValue === -1) {
      return handle.fail({
        errMsg: '请检查传入的 scrollTop 或 selector 是否合法'
      }, { resolve, reject })
    }

    try {
      nativeOtherManager.scrollTo(currentPageNode, {
        xOffset: scrollLeftValue,
        yOffset: scrollTopValue,
        duration,
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
