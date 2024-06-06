import { showActionSheet } from '@tarojs/taro-h5'

import native from '../../../NativeApi'
import { shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

namespace chooseMedium {
  export interface Option {
    /** 最多可以选择的文件个数
     * @default 9
     * @supported harmny-hybrid
     */
    count?: number
    /** 文件类型
     * @default ['image', 'video']
     * @supported harmny-hybrid
     */
    mediaType?: Array<keyof mediaType>
    /** 图片和视频选择的来源
     * @default ['album', 'camera']
     * @supported harmny-hybrid
     */
    sourceType?: Array<keyof sourceType>
    /** 拍摄视频最长拍摄时间，单位秒。时间范围为 3s 至 60s 之间
     * @default 10
     * @supported harmny-hybrid
     */
    maxDuration?: number
    /** 仅在 sourceType 为 camera 时生效,是否压缩文件
     * @default ['original', 'compressed']
     * @supported harmny-hybrid
     */
    sizeType?: Array<'original' | 'compressed'>
    /** 仅在 sourceType 为 camera 时生效，使用前置或后置摄像头
     * @default "back"
     * @supported harmny-hybrid
     */
    camera?: string
    /** 仅在 sourceType 为 album 时生效，相册中是否允许拍照
     * @default "false"
     * @supported harmny-hybrid
     */
    takingSupported?: boolean
    /** 仅在 sourceType 为 album 时生效，相册中是否允许编辑照片
     * @default "false"
     * @supported harmny-hybrid
     */
    editSupported?: boolean
    /** 仅在 sourceType 为 album 时生效，相册中是否允许搜索
     * @default "false"
     * @supported harmny-hybrid
     */
    searchSupported?: boolean
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: (res: TaroGeneral.CallbackResult) => void
    /** 接口调用失败的回调函数 */
    fail?: (res: TaroGeneral.CallbackResult) => void
    /** 接口调用成功的回调函数 */
    success?: (result: SuccessCallbackResult) => void
    /** 用来上传的input元素ID
     * @supported harmny-hybrid
     */
    mediaId?: string
  }
  export interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
    /** 本地临时文件列表 */
    tempFiles: ChooseMedium[]
    /** 文件类型，有效值有 image 、video、mix */
    type: string
  }

  /** 本地临时文件列表 */
  export interface ChooseMedium {
    /** 本地临时文件路径 (本地路径) */
    tempFilePath: string
    /** 本地临时文件大小，单位 B */
    size: number
    /** 视频的时间长度 */
    duration: number
    /** 视频的高度 */
    height: number
    /** 视频的宽度 */
    width: number
    /** 视频缩略图临时文件路径 */
    thumbTempFilePath: string
    /** 选择的文件的类型 */
    fileType: string
  }
  export interface mediaType {
    /** 只能拍摄视频或从相册选择视频 */
    video
    /** 只能拍摄图片或从相册选择图片 */
    image
    /** 可同时选择图片和视频 */
    mix
  }
  export interface sourceType {
    /** 从相册选择 */
    album
    /** 使用相机拍摄 */
    camera
  }
  export interface camera {
    /** 使用后置摄像头 */
    back
    /** 使用前置摄像头 */
    front
  }
}


interface harmony {
  /** 拍摄或从手机相册中选择图片或视频。
        * @supported harmony_hybrid
        * @example
        * ```tsx
        * Taro.chooseMedium({
        *   count: 9,
        *   mediaType: ['image','video'],
        *   sourceType: ['album', 'camera'],
        *   maxDuration: 30,
        *   camera: 'back',
        *   takingSupported: false,
        *   editSupported: false,
        *   searchSupported: false,
        *   success: (res) => {
        *     console.log(res.tempFiles)
        *     console.log(res.type)
        *   }
        * })
        * ```
        */
  chooseMedium (option: chooseMedium.Option): Promise<chooseMedium.SuccessCallbackResult>
}
/**
 * 拍摄或从手机相册中选择图片或视频
 *
 * @canUse chooseMedium
 * @__object [count, mediaType[video, image, mix], sourceType[album, camera], maxDuration, sizeType, camera[back, front],takingSupported,editSupported,searchSupported]
 * @__success [tempFiles, type]
 */
export const chooseMedium: harmony['chooseMedium'] = async (options) => {
  const name = 'chooseMedium'

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
    takingSupported = false,
    editSupported = false,
    searchSupported = false,
    success,
    fail,
  } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler<{
    tempFiles?: chooseMedium.ChooseMedium[]
    type?: string
    errMsg?: string
  }>({ name, success, fail })

  let sourceSelected
  if (sourceType.length === 1) {
    sourceSelected = sourceType[0]
  } else if (typeof sourceType !== 'object' || (sourceType.includes('album') && sourceType.includes('camera'))) {
    const selected = await showActionSheet({ itemList: ['拍摄', '从相册选择'] }).then(
      (res) => {
        sourceSelected = res.tapIndex === 0 ? 'camera' : 'album'
        return true
      },
      () => {
        return false
      }
    )
    if (!selected) {
      return handle.fail({ errMsg: 'fail cancel' })
    }
  }

  return new Promise<chooseMedium.SuccessCallbackResult>((resolve, reject) => {
    native.chooseMediumAssets({
      count: count,
      mediaType: mediaType,
      sourceType: sourceSelected,
      maxDuration: maxDuration,
      sizeType: sizeType,
      camera: camera,
      takingSupported: takingSupported,
      editSupported: editSupported,
      searchSupported: searchSupported,
      apiName: name,
      success: (res: any) => {
        const result: chooseMedium.SuccessCallbackResult = {
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
