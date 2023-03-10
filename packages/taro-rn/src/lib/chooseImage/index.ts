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

import SYImagePicker from 'react-native-syan-image-picker'

import { shouldBeObject } from '../../utils'
import { showActionSheet } from '../showActionSheet'

const res = { errMsg: 'chooseImage:ok' }
const defaultOptions = {
  count: 9,
  sizeType: ['original', 'compressed'],
  sourceType: ['album', 'camera']
}

function getRes(images) {
  const tempFilePaths: string[] = []
  const tempFiles: any[] = []
  images.forEach((item: any) => {
    tempFilePaths.push(item.uri)
    tempFiles.push({
      path: item.uri,
      size: item.size
    })
  })
  return { tempFilePaths, tempFiles }
}

function openCamera(options: Taro.chooseImage.Option): Promise<Taro.chooseImage.SuccessCallbackResult> {
  const { success, fail, complete } = options
  return new Promise((resolve, reject) => {
    SYImagePicker.openCamera({
      compressFocusAlpha: true
    }, (err, photo: any) => {
      if (err) {
        const res = {
          errMsg: err
        }
        fail?.(res)
        complete?.(res)
        reject(res)
      } else {
        try {
          const data = Object.assign({}, getRes(photo), res)
          success?.(data)
          complete?.(data)
          resolve(data)
        } catch (error) {
          // 错误
          reject(error)
        }
      }
    })
  })
}

// NOTE: 调用此函数会改变图片的像素尺寸
function openPicker(options: Taro.chooseImage.Option): Promise<Taro.chooseImage.SuccessCallbackResult> {
  const { count: imageCount, sizeType = [],success, complete, fail } = options
  return new Promise((resolve, reject) => {
    // NOTE：react-native-syan-image-picker 暂不支持 Android 端压缩
    SYImagePicker.showImagePicker({
      compressFocusAlpha: true,
      imageCount,
      quality: sizeType[0] === 'compressed' ? 70 : 90,
    }, (err, photos: any) => {
      if (err) {
        const res = {
          errMsg: err
        }
        fail?.(res)
        complete?.(res)
        reject(res)
      } else {
        try {
          const data = Object.assign({}, getRes(photos), res)
          success?.(data)
          complete?.(data)
          resolve(data)
        } catch (error) {
          reject(error)
        }
      }
    })
  })
}

/**
 * @description Display the image picker.
 * @param options
 * @returns {Promise}
 */
function showImagePicker(options: Taro.chooseImage.Option):Promise<Taro.chooseImage.SuccessCallbackResult> {
  const { fail, complete } = options
  return new Promise((resolve, reject) => {
    showActionSheet({
      itemList: ['拍照', '从手机相册选择'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex === 0) {
          // 不添加 setTimeout 会有一定概率卡死，肯能是与 sibling.destroy() 冲突
          setTimeout(() => {
            openCamera(options).then(res => {
              resolve(res)
            }).catch(e => {
              fail?.({ errMsg: `chooseImage:${e.message}` })
              complete?.({ errMsg: `chooseImage:${e.message}` })
              reject(new Error(`chooseImage:${e.message}`))
            })
          }, 100)
        }
        if (res.tapIndex === 1) {
          setTimeout(() => {
            openPicker(options).then(res => {
              resolve(res)
            }).catch(e => {
              fail?.({ errMsg: `chooseImage:${e.message}` })
              complete?.({ errMsg: `chooseImage:${e.message}` })
              reject(new Error(`chooseImage:${e.message}`))
            })
          }, 100)
        }
      },
      fail(res) {
        console.log('error: ', res.errMsg)
      }
    })
  })
}

/**
 * @deprecated
 * @description 从本地相册选择图片或使用相机拍照。
 *  sizeType ❌
 * @param options
 * @returns {Promise<*>}
 */
export function chooseImage(options: Taro.chooseImage.Option): Promise<Taro.chooseImage.SuccessCallbackResult> {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `chooseImage${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  options = Object.assign({}, defaultOptions, options)
  const { sourceType } = options

  switch (JSON.stringify(sourceType)) {
    case '[\'camera\']':
    case '["camera"]':
      return openCamera(options)
    case '[\'album\']':
    case '["album"]':
      return openPicker(options)
    default:
      return showImagePicker(options)
  }
}
