import Taro from '@tarojs/api'

import { MethodHandler } from '../../utils/handler'

const vibrator = function vibrator (mm: number | number[]) {
  try {
    return window.navigator.vibrate(mm)
  } catch (e) {
    console.warn('当前浏览器不支持 vibrate。')
  }
}

/**
 * 使手机发生较短时间的振动（15 ms）。仅在 iPhone 7 / 7 Plus 以上及 Android 机型生效
 */
export const vibrateShort: typeof Taro.vibrateShort = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'vibrateShort', success, fail, complete })
  if (vibrator(15)) {
    return handle.success()
  } else {
    return handle.fail({ errMsg: 'style is not support' })
  }
}

/**
 * 使手机发生较长时间的振动（400 ms)
 */
export const vibrateLong: typeof Taro.vibrateLong = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'vibrateLong', success, fail, complete })
  if (vibrator(400)) {
    return handle.success()
  } else {
    return handle.fail({ errMsg: 'style is not support' })
  }
}
