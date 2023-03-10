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

import { temporarilyNotSupport } from '../../utils'
import { CallbackManager } from '../../utils/handler'

const callbackManager = new CallbackManager()

const resizeListener = () => {
  callbackManager.trigger({
    windowWidth: window.screen.width,
    windowHeight: window.screen.height
  })
}

/**
 * 设置窗口大小，该接口仅适用于 PC 平台，使用细则请参见指南
 */
export const setWindowSize = temporarilyNotSupport('setWindowSize')

/**
 * 监听窗口尺寸变化事件
 */
export const onWindowResize: typeof Taro.onWindowResize = callback => {
  callbackManager.add(callback)
  if (callbackManager.count() === 1) {
    window.addEventListener('resize', resizeListener)
  }
}

/**
 * 取消监听窗口尺寸变化事件
 */
export const offWindowResize: typeof Taro.offWindowResize = callback => {
  callbackManager.remove(callback)
  if (callbackManager.count() === 0) {
    window.removeEventListener('resize', resizeListener)
  }
}
