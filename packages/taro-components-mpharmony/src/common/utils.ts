import Taro from '@tarojs/taro'
import { SelectorQuery } from '@tarojs/taro/types/index'

const ENV = Taro.getEnv()

function delay (delayTime = 25): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, delayTime)
  })
}


function delayQuerySelector (
  selectorStr: string,
  delayTime = 500
): Promise<any[]> {
  return new Promise(resolve => {
    const selector: SelectorQuery = Taro.createSelectorQuery()
    delay(delayTime).then(() => {
      selector
        .select(selectorStr)
        .boundingClientRect()
        .exec((res: any[]) => {
          resolve(res)
        })
    })
  })
}

function delayGetScrollOffset ({ delayTime = 500 }): Promise<any[]> {
  return new Promise(resolve => {
    delay(delayTime).then(() => {
      Taro.createSelectorQuery()
        .selectViewport()
        .scrollOffset()
        .exec((res: any[]) => {
          resolve(res)
        })
    })
  })
}

function delayGetClientRect ({ selectorStr, delayTime = 500 }): Promise<any[]> {
  const selector: SelectorQuery = Taro.createSelectorQuery()

  return new Promise(resolve => {
    delay(delayTime).then(() => {
      selector
        .select(selectorStr)
        .boundingClientRect()
        .exec((res: any[]) => {
          resolve(res)
        })
    })
  })
}

function uuid (len = 8, radix = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const value: string[] = []
  let i = 0
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) value[i] = chars[0 | (Math.random() * radix)]
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    /* eslint-disable-next-line */
    value[8] = value[13] = value[18] = value[23] = '-'
    value[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!value[i]) {
        r = 0 | (Math.random() * 16)
        value[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return value.join('')
}

interface EventDetail {
  pageX: number
  pageY: number
  clientX: number
  clientY: number
  offsetX: number
  offsetY: number
  x: number
  y: number
}

function getEventDetail (event: any): EventDetail {
  let detail: EventDetail
  switch (ENV) {
    case Taro.ENV_TYPE.WEB:
      detail = {
        pageX: event.pageX,
        pageY: event.pageY,
        clientX: event.clientX,
        clientY: event.clientY,
        offsetX: event.offsetX,
        offsetY: event.offsetY,
        x: event.x,
        y: event.y
      }
      break

    case Taro.ENV_TYPE.WEAPP:
      detail = {
        pageX: event.touches[0].pageX,
        pageY: event.touches[0].pageY,
        clientX: event.touches[0].clientX,
        clientY: event.touches[0].clientY,
        offsetX: event.target.offsetLeft,
        offsetY: event.target.offsetTop,
        x: event.target.x,
        y: event.target.y
      }
      break

    case Taro.ENV_TYPE.ALIPAY:
      detail = {
        pageX: event.target.pageX,
        pageY: event.target.pageY,
        clientX: event.target.clientX,
        clientY: event.target.clientY,
        offsetX: event.target.offsetLeft,
        offsetY: event.target.offsetTop,
        x: event.target.x,
        y: event.target.y
      }
      break

    case Taro.ENV_TYPE.SWAN:
      detail = {
        pageX: event.changedTouches[0].pageX,
        pageY: event.changedTouches[0].pageY,
        clientX: event.target.clientX,
        clientY: event.target.clientY,
        offsetX: event.target.offsetLeft,
        offsetY: event.target.offsetTop,
        x: event.detail.x,
        y: event.detail.y
      }
      break

    default:
      detail = {
        pageX: 0,
        pageY: 0,
        clientX: 0,
        clientY: 0,
        offsetX: 0,
        offsetY: 0,
        x: 0,
        y: 0
      }
      console.warn('getEventDetail暂未支持该环境')
      break
  }
  return detail
}

function initTestEnv (): void {
  if (process.env.NODE_ENV === 'test') {
    Taro.initPxTransform({
      designWidth: 750,
      deviceRatio: {
        '640': 2.34 / 2,
        '750': 1,
        '828': 1.81 / 2
      }
    })
  }
}

function isTest (): boolean {
  return process.env.NODE_ENV === 'test'
}

let scrollTop = 0

function handleTouchScroll (flag: any): void {
  if (ENV !== Taro.ENV_TYPE.WEB) {
    return
  }
  if (flag) {
    scrollTop = document.documentElement.scrollTop

    // 使body脱离文档流
    document.body.classList.add('at-frozen')

    // 把脱离文档流的body拉上去！否则页面会回到顶部！
    document.body.style.top = `${-scrollTop}px`
  } else {
    document.body.style.top = ''
    document.body.classList.remove('at-frozen')

    document.documentElement.scrollTop = scrollTop
  }
}

function pxTransform (size: number): string {
  if (!size) return ''
  const designWidth = 750
  const deviceRatio = {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  }
  return `${size / deviceRatio[designWidth]}rpx`
}

function objectToString (style: object | string): string {
  if (style && typeof style === 'object') {
    let styleStr = ''
    Object.keys(style).forEach(key => {
      const lowerCaseKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      styleStr += `${lowerCaseKey}:${style[key]};`
    })
    return styleStr
  } else if (style && typeof style === 'string') {
    return style
  }
  return ''
}

/**
 * 合并 style
 * @param {Object|String} style1
 * @param {Object|String} style2
 * @returns {String}
 */
function mergeStyle (
  style1: object | string,
  style2: object | string
): object | string {
  if (
    style1 &&
    typeof style1 === 'object' &&
    style2 &&
    typeof style2 === 'object'
  ) {
    return Object.assign({}, style1, style2)
  }
  return objectToString(style1) + objectToString(style2)
}

export {
  delay,
  delayGetClientRect,
  delayGetScrollOffset,
  delayQuerySelector,
  getEventDetail,
  handleTouchScroll,
  initTestEnv,
  isTest,
  mergeStyle,
  pxTransform,
  uuid }

export function throttle (fn, threshold = 250, scope?) {
  let lastTime = 0
  let deferTimer: ReturnType<typeof setTimeout>
  return function (...args) {
    const context = scope || this
    const now = Date.now()
    if (now - lastTime > threshold) {
      fn.apply(this, args)
      lastTime = now
    } else {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(() => {
        lastTime = now
        fn.apply(context, args)
      }, threshold)
    }
  }
}

export function debounce (fn, ms = 250, scope?) {
  let timer: ReturnType<typeof setTimeout>

  return function (...args) {
    const context = scope || this
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, ms)
  }
}

