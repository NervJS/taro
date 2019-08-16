import React from 'react'
import ImagePicker from 'react-native-image-crop-picker'
import { shouleBeObject } from '../utils'
import { showActionSheet } from '../interface'

const res = {errMsg: 'chooseImage:ok'}
const defaultOptions = {
  count: 9,
  sizeType: ['original', 'compressed'],
  sourceType: ['album', 'camera']
}

/**
 * @deprecated
 * @description 从本地相册选择图片或使用相机拍照。
 *  sizeType ❌
 * @param options
 * @returns {Promise<*>}
 */
export function chooseImage (options) {
  // options must be an Object
  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = {errMsg: `chooseImage${isObject.msg}`}
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  options = Object.assign({}, defaultOptions, options)
  const {sourceType} = options

  switch (JSON.stringify(sourceType)) {
    case '[\'camera\']':
      return openCamera(options)
    case '[\'album\']':
      return openPicker(options)
    default:
      return showImagePicker(options)
  }
}

function openCamera (options) {
  const {success, fail, complete} = options
  return ImagePicker.openCamera({}).then(image => {
    const result = {
      tempFilePaths: [image.path],
      tempFiles: [
        {
          path: image.path,
          size: image.size
        }]
    }
    const data = Object.assign({}, result, res)
    success && success(data)
    complete && complete(data)
    return data
  })
}

function openPicker (options) {
  console.log(options)
  const {count: maxFiles, success, complete} = options
  return ImagePicker.openPicker({
    multiple: true,
    maxFiles
  }).then(images => {
    console.log(images)
    let data = Object.assign({}, getRes(images), res)
    success && success(data)
    complete && complete(data)
    return data
  })
}

function getRes (images) {
  let tempFilePaths = []
  let tempFiles = []
  images.forEach(item => {
    tempFilePaths.push(item.path)
    tempFiles.push({
      path: item.path,
      size: item.size
    })
  })
  return {tempFilePaths, tempFiles}
}

/**
 * @description Display the image picker.
 * @param options
 * @returns {Promise}
 */
function showImagePicker (options) {
  const {fail, complete} = options
  return new Promise((resolve, reject) => {
    showActionSheet({
      itemList: ['拍照', '从手机相册选择'],
      success (res) {
        console.log(res.tapIndex)
        if (res.tapIndex === 0) {
          // 不添加 setTimeout 会有一定概率卡死，肯能是与 sibling.destroy() 冲突
          setTimeout(() => {
            openCamera(options).then(res => {
              resolve(res)
            }).catch(e => {
              fail && fail({errMsg: `chooseImage:${e.message}`})
              complete && complete({errMsg: `chooseImage:${e.message}`})
              reject(new Error(`chooseImage:${e.message}`))
            })
          }, 100)
        }
        if (res.tapIndex === 1) {
          setTimeout(() => {
            openPicker(options).then(res => {
              resolve(res)
            }).catch(e => {
              fail && fail({errMsg: `chooseImage:${e.message}`})
              complete && complete({errMsg: `chooseImage:${e.message}`})
              reject(new Error(`chooseImage:${e.message}`))
            })
          }, 100)
        }
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  })
}
