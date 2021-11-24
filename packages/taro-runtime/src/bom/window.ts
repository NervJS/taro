import { noop } from '@tarojs/shared'
import { navigator } from './navigator'
import { document } from './document'
import { win } from '../env'
import { raf, caf } from './raf'
import { getComputedStyle } from './getComputedStyle'
import { DATE } from '../constants'

export const window: any = process.env.TARO_ENV === 'h5' ? win : {
  navigator,
  document
}

if (process.env.TARO_ENV && process.env.TARO_ENV !== 'h5') {
  const globalProperties = [
    ...Object.getOwnPropertyNames(global || win),
    ...Object.getOwnPropertySymbols(global || win)
  ]

  globalProperties.forEach(property => {
    if (property === 'atob') return
    if (!Object.prototype.hasOwnProperty.call(window, property)) {
      window[property] = global[property]
    }
  })

  window.requestAnimationFrame = raf
  window.cancelAnimationFrame = caf
  window.getComputedStyle = getComputedStyle
  window.addEventListener = noop
  window.removeEventListener = noop
  if (!(DATE in window)) {
    window.Date = Date
  }
  window.setTimeout = function (cb, delay) {
    setTimeout(cb, delay)
  }
  window.clearTimeout = function (seed) {
    clearTimeout(seed)
  }

  document.defaultView = window
}
