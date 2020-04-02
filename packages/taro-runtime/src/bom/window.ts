import { navigator } from './navigator'
import { document } from './document'
import { isBrowser, win } from '../env'

export const window = isBrowser ? win : {
  navigator,
  document
}

if (process.env.TARO_ENV === 'tt') {
  (window as any).requestAnimationFrame = requestAnimationFrame;
  (window as any).cancelAnimationFrame = cancelAnimationFrame;
  (window as any).Date = Date;
  (window as any).setTimeout = setTimeout
}

if (process.env.TARO_ENV === 'swan') {
  const { polyfill } = require('raf')
  polyfill(window);
  (window as any).Date = Date;
  (window as any).setTimeout = setTimeout
}
