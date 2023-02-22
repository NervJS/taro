/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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

import { findDOM } from '../../utils'
import { MethodHandler } from '../../utils/handler'

/**
 * 获取 canvas 区域隐含的像素数据。
 */
export const canvasGetImageData: typeof Taro.canvasGetImageData = ({ canvasId, success, fail, complete, x, y, width, height }, inst) => {
  const handle = new MethodHandler({ name: 'canvasGetImageData', success, fail, complete })
  const el = findDOM(inst) as HTMLElement
  const canvas = el?.querySelector(`canvas[canvas-id="${canvasId}"]`) as HTMLCanvasElement

  try {
    const ctx = canvas?.getContext('2d')
    // TODO ImageData => Uint8ClampedArray
    const data = ctx?.getImageData(x, y, width, height) as unknown as Uint8ClampedArray
    return handle.success({
      width,
      height,
      data
    })
  } catch (e) {
    return handle.fail({
      errMsg: e.message
    })
  }
}
