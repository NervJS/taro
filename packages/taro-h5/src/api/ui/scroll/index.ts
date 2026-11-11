import Taro from '@tarojs/api'
import { Current } from '@tarojs/runtime'

import { easeInOut, getTimingFunc } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

const activeScrolls: WeakMap<Window | HTMLElement, () => void> = new WeakMap()
const FRAME_DURATION = 17

/**
 * 将页面滚动到目标位置
 */
export const pageScrollTo: typeof Taro.pageScrollTo = ({ scrollTop, selector: requestedSelector = '', offsetTop = 0, duration = 300, success, fail, complete }) => {
  const hasScrollTop = typeof scrollTop === 'number'
  const selector = hasScrollTop ? '' : requestedSelector
  let scrollFunc
  const handle = new MethodHandler({ name: 'pageScrollTo', success, fail, complete })
  return new Promise((resolve, reject) => {
    const failScroll = (errMsg: string) => {
      try {
        handle.fail({ errMsg }, { resolve, reject })
      } catch (error) {
        reject(error)
      }
    }

    try {
      if (scrollTop === undefined && !selector) {
        return failScroll('scrollTop" 或 "selector" 需要其之一')
      }

      const usingWindowScroll = (window as any).__taroAppConfig?.usingWindowScroll
      const id = Current.page?.path?.replace(/([^a-z0-9\u00a0-\uffff_-])/ig, '\\$1')
      const el: HTMLDivElement | null = (id
        ? document.querySelector(`.taro_page#${id}`)
        : document.querySelector('.taro_page') ||
      document.querySelector('.taro_router')) as HTMLDivElement

      if (!scrollFunc) {
        if (usingWindowScroll) {
          scrollFunc = pos => {
            if (pos === undefined) {
              return window.pageYOffset
            } else {
              window.scrollTo(0, pos)
            }
          }
        } else {
          scrollFunc = pos => {
            if (pos === undefined) {
              return el.scrollTop
            } else {
              el.scrollTop = pos
            }
          }
        }
      }

      if (hasScrollTop && requestedSelector) {
        console.warn('"scrollTop" 或 "selector" 建议只设一个值，全部设置会忽略selector')
      }
      let to: number
      if (selector) {
        const root = el ?? (id ? null : document)
        const target = el?.matches(selector) ? el : root?.querySelector<HTMLElement>(selector)
        if (!target) {
          throw new Error('selector not found')
        }
        to = (target.offsetTop || 0) + offsetTop
      } else {
        to = hasScrollTop ? scrollTop : 0
      }
      const from = scrollFunc()
      const delta = to - from

      const frameCnt = Math.ceil(duration / FRAME_DURATION)
      const easeFunc = getTimingFunc(easeInOut, frameCnt + 1)

      const scrollTarget = usingWindowScroll ? window : el
      let timer: ReturnType<typeof setTimeout> | undefined
      const interrupt = () => {
        clearTimeout(timer)
        failScroll('interrupted by another scroll')
      }

      const scroll = (frame = 0) => {
        if (activeScrolls.get(scrollTarget) !== interrupt) return
        const atTarget = frame >= frameCnt
        try {
          scrollFunc(atTarget ? to : from + delta * easeFunc(frame))
        } catch (error) {
          activeScrolls.delete(scrollTarget)
          return failScroll(error.message)
        }
        if (atTarget) {
          activeScrolls.delete(scrollTarget)
          try {
            handle.success({}, { resolve, reject })
          } catch (error) {
            reject(error)
          }
          return
        }
        timer = setTimeout(() => scroll(frame + 1), FRAME_DURATION)
      }

      const previous = activeScrolls.get(scrollTarget)
      // Cancellation callbacks may start another scroll on this target.
      activeScrolls.set(scrollTarget, interrupt)
      previous?.()
      scroll()
    } catch (error) {
      failScroll(error.message)
    }
  })
}
