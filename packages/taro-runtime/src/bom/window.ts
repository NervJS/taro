import { navigator } from './navigator'
import { document } from './document'
import { isBrowser, win } from '../env'
import { raf, caf } from './raf'
import { getComputedStyle } from './getComputedStyle'

export const window = isBrowser ? win : {
  navigator,
  document
}

if (!isBrowser) {
  const globalProperties = [
    ...Object.getOwnPropertyNames(global || win),
    ...Object.getOwnPropertySymbols(global || win)
  ]

  globalProperties.forEach(property => {
    if (!Object.prototype.hasOwnProperty.call(window, property)) {
      window[property] = global[property]
    }
  })
}

if (process.env.TARO_ENV !== 'h5') {
  (window as any).requestAnimationFrame = raf;
  (window as any).cancelAnimationFrame = caf;
  (window as any).getComputedStyle = getComputedStyle
  if (!('Date' in window)) {
    (window as any).Date = Date
  }
  if (!('setTimeout' in window)) {
    (window as any).setTimeout = setTimeout
  }
}
