import Taro from '@tarojs/api'
import { showActionSheet } from '@tarojs/taro-h5'

import { shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'
import native from '../../NativeApi'


/**
 * 拍摄视频或从手机相册中选视频
 *
 * @canUse chooseVideo
 * @__object [camera[back, front], compressed, maxDuration, sourceType[album, camera]]
 * @__success [tempFilePath, duration, size, height, width]
 */
export const chooseVideo: typeof Taro.chooseVideo = async (options) => {
  const name = 'chooseVideo'

  // options must be an Object
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    compressed = true,
    sourceType = ['album', 'camera'],
    maxDuration = 60,
    camera = 'back',
    success,
    fail,
  } = options as Exclude<typeof options, undefined>
  const mediaType = ['video']

  const handle = new MethodHandler<{
    tempFilePath?: string
    duration?: number
    size?: number
    height?: number
    width?: number
    errMsg?: string
  }>({ name, success, fail })

  const sizeType = compressed ? ['compressed'] : ['original']

  // @ts-ignore
  let sourceSelected: string
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

  return new Promise<Taro.chooseVideo.SuccessCallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.chooseMediaAssets({
      count: 1,
      sizeType: sizeType,
      mediaType: mediaType,
      sourceType: sourceSelected,
      maxDuration: maxDuration,
      camera: camera,
      apiName: name,
      success: (res: any) => {
        const result: Taro.chooseVideo.SuccessCallbackResult = {
          duration: res.tempFiles[0].duration,
          height: res.tempFiles[0].height,
          size: res.tempFiles[0].size,
          tempFilePath: res.tempFiles[0].tempFilePath,
          width: res.tempFiles[0].width,
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

