import Taro from '@tarojs/api'

import { MethodHandler } from '../../utils/handler'
import { getTimingFunc, easeInOut } from '../../utils'

let scrollFunc
let timer: NodeJS.Timeout
const FRAME_DURATION = 17

/**
 * 将页面滚动到目标位置
 */
export const pageScrollTo: typeof Taro.pageScrollTo = ({ scrollTop, selector = '', duration = 300, success, fail, complete }) => {
  const handle = new MethodHandler({ name: 'pageScrollTo', success, fail, complete })
  return new Promise((resolve, reject) => {
    try {
      if (scrollTop === undefined && !selector) {
        return handle.fail({
          errMsg: 'scrollTop" 或 "selector" 需要其之一'
        }, reject)
      }

      let el
      if (document.querySelector('.taro-tabbar__tabbar') === null) {
        // 没设置tabbar
        el = window
      } else {
        // 有设置tabbar
        el = document.querySelector('.taro-tabbar__panel') || window
      }

      if (!scrollFunc) {
        if (el === window) {
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
      if (typeof scrollTop === 'number') {
        to = scrollTop
      } else {
        const el = document.querySelector(selector) as HTMLElement
        to = el?.offsetTop || 0
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
          return handle.success({}, resolve)
        }
      }
      scroll()
    } catch (e) {
      return handle.fail({
        errMsg: e.message
      }, reject)
    }
  })
}
