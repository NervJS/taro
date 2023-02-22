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

import { shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

/**
 * 获取图片信息。网络图片需先配置download域名才能生效。
 */
export const getImageInfo: typeof Taro.getImageInfo = (options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `getImageInfo:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const getBase64Image = (image: HTMLImageElement) => {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(image, 0, 0, image.width, image.height)
      return canvas.toDataURL('image/png')
    } catch (e) {
      console.error('getImageInfo:get base64 fail', e)
    }
  }

  const { src, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'getImageInfo', success, fail, complete })
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = ''
    image.onload = () => {
      handle.success({
        width: image.naturalWidth,
        height: image.naturalHeight,
        path: getBase64Image(image) || src
      }, { resolve, reject })
    }
    image.onerror = (e: any) => {
      handle.fail({
        errMsg: e.message
      }, { resolve, reject })
    }
    image.src = src
  })
}
