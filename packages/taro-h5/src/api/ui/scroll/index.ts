import Taro from '@tarojs/api'
import { Current } from '@tarojs/runtime'

import { easeInOut, getTimingFunc } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

let timer: ReturnType<typeof setTimeout>
const FRAME_DURATION = 17

/**
 * 将页面滚动到目标位置
 */
export const pageScrollTo: typeof Taro.pageScrollTo = ({ scrollTop, selector = '', offsetTop = 0, duration = 300, success, fail, complete }) => {
  let scrollFunc
  const handle = new MethodHandler({ name: 'pageScrollTo', success, fail, complete })
  return new Promise((resolve, reject) => {
    try {
      if (scrollTop === undefined && !selector) {
        return handle.fail({
          errMsg: 'scrollTop" 或 "selector" 需要其之一'
        }, { resolve, reject })
      }

      const id = Current.page?.path?.replace(/([^a-z0-9\u00a0-\uffff_-])/ig, '\\$1')
      const el: HTMLDivElement | null = (id
        ? document.querySelector(`.taro_page#${id}`)
        : document.querySelector('.taro_page') ||
      document.querySelector('.taro_router')) as HTMLDivElement

      if (!scrollFunc) {
        if (!el) {
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

      if (scrollTop && selector) {
        console.warn('"scrollTop" 或 "selector" 建议只设一个值，全部设置会忽略selector')
      }
      const from = scrollFunc()
      let to: number
      if (selector) {
        const el = document.querySelector(selector) as HTMLElement
        to = (el?.offsetTop || 0) + offsetTop
      } else {
        to = typeof scrollTop === 'number' ? scrollTop : 0
      }
      const delta = to - from

      const frameCnt = duration / FRAME_DURATION
      const easeFunc = getTimingFunc(easeInOut, frameCnt)

      const scroll = (frame = 0) => {
        const dest = from + delta * easeFunc(frame)
        scrollFunc(dest)
        if (frame < frameCnt) {
          timer && clearTimeout(timer)
          timer = setTimeout(() => {
            scroll(frame + 1)
          }, FRAME_DURATION)
        } else {
          return handle.success({}, { resolve, reject })
        }
      }
      scroll()
    } catch (e) {
      return handle.fail({
        errMsg: e.message
      }, { resolve, reject })
    }
  })
}
