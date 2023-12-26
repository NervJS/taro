import Taro from '@tarojs/api'
import { showActionSheet } from '@tarojs/taro-h5'

import { shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

/**
 * 从本地相册选择图片或使用相机拍照。
 * 
 * @canUse chooseImage
 * @__object [count, sizeType[original, compressed], sourceType[album, camera]]
 * @__success [tempFilePaths, tempFiles]
 */
export const chooseImage: typeof Taro.chooseImage = async (options) => {
  const name = 'chooseImage'

  // options must be an Object
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    count = 9,
    sourceType = ['album', 'camera'],
    sizeType = ['original', 'compressed'],
    success,
    fail,
  } = options as Exclude<typeof options, undefined>
  const mediaType = ['image']

  const handle = new MethodHandler<{
    tempFilePaths?: string[]
    tempFiles?: Taro.chooseImage.ImageFile[]
    errMsg?: string
  }>({ name, success, fail })

  let sourceSelected
  if (sourceType.length === 1) {
    sourceSelected = sourceType[0]
  } else if (typeof sourceType !== 'object' || (sourceType.includes('album') && sourceType.includes('camera'))) {
    const selected = await showActionSheet({ itemList: ['拍摄', '从相册选择'] }).then((res) => {
      sourceSelected = (res.tapIndex === 0 ? 'camera' : 'album')
      return true
    }, () => {
      return false
    })
    if (!selected) {
      return handle.fail({ errMsg: 'fail cancel' })
    }
  }

  return new Promise<Taro.chooseImage.SuccessCallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.chooseMediaAssets({
      count: count,
      mediaType: mediaType,
      sourceType: sourceSelected,
      sizeType: sizeType,
      apiName: name,
      success: (res: any) => {      
        const tempFiles: Taro.chooseImage.ImageFile[] = [] 
        for (const file of res.tempFiles) {
          const fileInfo: Taro.chooseImage.ImageFile = {
            path: file.tempFilePath,
            size: file.size,
            type: file.tempFilePath.split('.').pop(),
          }
          tempFiles.push(fileInfo)
        }
        const result: Taro.chooseImage.SuccessCallbackResult = {
          tempFilePaths: res.tempFilePaths,
          tempFiles: tempFiles,
          errMsg: res.errMsg,
        }
        handle.success(result, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
