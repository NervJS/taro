import Taro from '@tarojs/taro'
import { showActionSheet } from '@tarojs/taro-h5'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 拍摄或从手机相册中选择图片或视频
 * 
 * @canUse chooseMedia 
 * @__object [count, mediaType[video, image, mix], sourceType[album, camera], maxDuration, sizeType, camera[back, front]]
 * @__success [tempFiles, type] 
 */
export const chooseMedia: typeof Taro.chooseMedia = async (options) => {
  const name = 'chooseMedia'

  // options must be an Object
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    count = 9,
    mediaType = ['video', 'image'],
    sourceType = ['album', 'camera'],
    maxDuration = 10,
    sizeType = ['original', 'compressed'],
    camera = 'back',
    success,
    fail,
  } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler<{
    tempFiles?: Taro.chooseMedia.ChooseMedia[]
    type?: string
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

  return new Promise<Taro.chooseMedia.SuccessCallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.chooseMediaAssets({
      count: count,
      mediaType: mediaType,
      sourceType: sourceSelected,
      maxDuration: maxDuration,
      sizeType: sizeType,
      camera: camera,
      apiName: name,
      success: (res: any) => {       
        const result: Taro.chooseMedia.SuccessCallbackResult = {
          tempFiles: res.tempFiles,
          type: res.type,
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
