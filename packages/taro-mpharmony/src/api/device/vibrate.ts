import Taro from '@tarojs/api'

import { MethodHandler } from '../../utils/handler'

/**
 * 使手机发生较短时间的振动（15 ms）。仅在 iPhone 7 / 7 Plus 以上及 Android 机型生效
 */
export const vibrateShort: typeof Taro.vibrateShort = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'vibrateShort', success, fail, complete })
  return new Promise((resolve, reject) => {
    // @ts-ignore
    native.vibrateShort({
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (res: any) => {
        handle.fail(res, { resolve, reject })
      },
    })
  })
}

/**
 * 使手机发生较长时间的振动（400 ms)
 */
export const vibrateLong: typeof Taro.vibrateLong = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'vibrateLong', success, fail, complete })
  return new Promise((resolve, reject) => {
    // @ts-ignore
    native.vibrateLong({
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (res: any) => {
        handle.fail(res, { resolve, reject })
      },
    })
  })
}
