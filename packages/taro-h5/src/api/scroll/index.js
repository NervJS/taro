import { getTimingFunc, easeInOut } from '../utils/index'

/**
 * @typedef {object} PageScrollToParam pageScrollTo参数
 * @property {number} scrollTop 滚动到页面的目标位置，单位 px
 * @property {number} [duration=300] 滚动动画的时长，单位 ms
 * @property {function} [success] 接口调用成功的回调函数
 * @property {function} [fail] 接口调用失败的回调函数
 * @property {function} [complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */

let scrollFunc
let timer
const FRAME_DURATION = 17

/**
 * 将页面滚动到目标位置
 * @param {PageScrollToParam} object 参数
 */
export const pageScrollTo = ({ scrollTop, duration=300, success, fail, complete }) => {
  return new Promise((resolve, reject) => {
    try {
      if (scrollTop === undefined) {
        throw Error('"scrollTop" is required')
      }
      const el = document.querySelector('.taro-tabbar__panel') || window

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
      
      const from = scrollFunc()
      const to = scrollTop
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
          const res = {
            errMsg: 'pageScrollTo:ok'
          }
          success && success(res)
          complete && complete()
          resolve(res)
        }
      }
      scroll()
    } catch (e) {
      const res = {
        errMsg: `pageScrollTo:fail ${e.message}`
      }
      fail && fail(res)
      complete && complete()
      reject(res)
    }
  })
}
