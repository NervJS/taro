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
 *  SOFTWARE.
 */

import { isFunction, isObject } from './utils'

export function Behavior (options) {
  return options
}

export function getPreload (current) {
  return function (key, val) {
    current.preloadData = isObject(key)
      ? key
      : {
        [key]: val
      }
  }
}

const defaultDesignWidth = 750
const defaultDesignRatio = {
  640: 2.34 / 2,
  750: 1,
  828: 1.81 / 2
}
const defaultBaseFontSize = 20

export function getInitPxTransform (taro) {
  return function (config) {
    const {
      designWidth = defaultDesignWidth,
      deviceRatio = defaultDesignRatio,
      baseFontSize = defaultBaseFontSize
    } = config
    taro.config = taro.config || {}
    taro.config.designWidth = designWidth
    taro.config.deviceRatio = deviceRatio
    taro.config.baseFontSize = baseFontSize
  }
}

export function getPxTransform (taro) {
  return function (size) {
    const config = taro.config || {}
    const deviceRatio = config.deviceRatio || defaultDesignRatio
    const designWidth = (((input = 0) => isFunction(config.designWidth)
      ? config.designWidth(input)
      : config.designWidth || defaultDesignWidth))(size)
    if (!(designWidth in deviceRatio)) {
      throw new Error(`deviceRatio 配置中不存在 ${designWidth} 的设置！`)
    }
    return (parseInt(size, 10) * deviceRatio[designWidth]) + 'rpx'
  }
}
