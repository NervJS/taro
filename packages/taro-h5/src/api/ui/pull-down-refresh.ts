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
/**
 * 开始下拉刷新。调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
 */
export const startPullDownRefresh: typeof Taro.startPullDownRefresh = function ({ success, fail, complete } = {}) {
  const handle = new MethodHandler({ name: 'startPullDownRefresh', success, fail, complete })
  return new Promise((resolve, reject) => {
    Taro.eventCenter.trigger('__taroStartPullDownRefresh', {
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })
  })
}

/**
 * 停止当前页面下拉刷新。
 */
export const stopPullDownRefresh: typeof Taro.stopPullDownRefresh = function ({ success, fail, complete } = {}) {
  const handle = new MethodHandler({ name: 'stopPullDownRefresh', success, fail, complete })
  return new Promise((resolve, reject) => {
    Taro.eventCenter.trigger('__taroStopPullDownRefresh', {
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })
  })
}
