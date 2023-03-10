/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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
