import SYImagePicker from 'react-native-syan-image-picker'

import { shouleBeObject } from '../../utils'
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
    SYImagePicker.openCamera({}, (err, photo: any) => {
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

function openPicker(options: Taro.chooseImage.Option): Promise<Taro.chooseImage.SuccessCallbackResult> {
  const { count: imageCount, success, complete, fail } = options
  return new Promise((resolve, reject) => {
    SYImagePicker.showImagePicker({
      imageCount,
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
  const isObject = shouleBeObject(options)
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
