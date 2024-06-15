import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import { Camera } from 'expo-camera'
import {
  ImagePickerAsset,
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker'

import { errorHandler, successHandler } from '../utils'
import { showActionSheet } from './showActionSheet'

export const MEDIA_TYPE = MediaTypeOptions

export async function saveMedia(opts: Taro.saveImageToPhotosAlbum.Option | Taro.saveVideoToPhotosAlbum.Option, type:string, API:string):Promise<TaroGeneral.CallbackResult> {
  const { filePath, success, fail, complete } = opts
  const { granted } = await requestMediaLibraryPermissionsAsync()
  if (!granted) {
    const res = { errMsg: 'Permissions denied!' }
    return errorHandler(fail, complete)(res)
  }

  const res: any = { errMsg: `${API}:ok` }
  const saveType = (type === 'video' || type === 'photo') ? type : 'auto'
  try {
    const url: string = await CameraRoll.save(filePath, { type: saveType })
    res.path = url
    return successHandler(success, complete)(res)
  } catch (err) {
    res.errMsg = err.message
    return errorHandler(fail, complete)(res)
  }
}

async function showPicker(opts: Taro.chooseImage.Option | Taro.chooseVideo.Option | Taro.chooseMedia.Option, mediaTypes: MediaTypeOptions):Promise<any> {
  const { fail, complete } = opts
  try {
    const res = await showActionSheet({
      itemList: ['拍摄', '从手机相册选择'],
    })
    if (res.tapIndex === 0) {
      return _chooseMedia({ ...opts, sourceType: ['camera'] }, mediaTypes)
    }
    if (res.tapIndex === 1) {
      return _chooseMedia({ ...opts, sourceType: ['album'] }, mediaTypes)
    }
  } catch (err) {
    const res = {
      errMsg: `choose${
        mediaTypes === MediaTypeOptions.Images ? 'Image' : mediaTypes === MediaTypeOptions.Videos ? 'Video' : 'Media'
      } fail`
    }
    fail?.(res)
    complete?.(res)
  }
}

export async function chooseMedia(opts: Taro.chooseImage.Option | Taro.chooseVideo.Option | Taro.chooseMedia.Option = {}, mediaTypes: MediaTypeOptions): Promise<TaroGeneral.CallbackResult> {
  const {
    sourceType = ['album', 'camera'],
  } = opts
  if (sourceType?.includes('camera') && sourceType?.includes('album')) {
    return showPicker(opts, mediaTypes)
  } else if (sourceType?.includes('camera')) {
    return _chooseMedia({ ...opts, sourceType: ['camera'] }, mediaTypes)
  }
  return _chooseMedia({ ...opts, sourceType: ['album'] }, mediaTypes)
}

export async function _chooseMedia(opts: Taro.chooseImage.Option | Taro.chooseVideo.Option | Taro.chooseMedia.Option = {}, mediaTypes: MediaTypeOptions): Promise<TaroGeneral.CallbackResult> {
  const {
    sizeType = [],
    sourceType = [],
    success,
    fail,
    complete,
    maxDuration,
    count = (mediaTypes === MEDIA_TYPE.Videos ? 1 : 9),
    compressed
  } = opts as any
  const options = {
    mediaTypes,
    quality: (sizeType[0] === 'compressed' || compressed) ? 0.7 : 1,
    videoMaxDuration: maxDuration,
    allowsMultipleSelection: count > 1,
    selectionLimit: count,
  }
  const messString = mediaTypes === MediaTypeOptions.Images ? 'Image' : mediaTypes === MediaTypeOptions.Videos ? 'Video' : 'Media'
  const isCamera = sourceType[0] === 'camera'
  const { granted } = isCamera ? await Camera.requestCameraPermissionsAsync() : await requestMediaLibraryPermissionsAsync()
  if (!granted) {
    const res = { errMsg: 'Permissions denied!' }
    return errorHandler(fail, complete)(res)
  }

  const launchMediaAsync = isCamera ? launchCameraAsync : launchImageLibraryAsync
  try {
    const resp = await launchMediaAsync(options)
    let res: any = {}
    if (mediaTypes === MEDIA_TYPE.Videos) {
      const asset = resp.assets?.[0]
      res = {
        ...asset,
        tempFilePath: asset?.uri,
        size: asset?.fileSize,
      }
    } else {
      res = {
        tempFilePaths: resp.assets?.map((item) => item.uri),
        tempFiles: resp.assets?.map((item: ImagePickerAsset) => ({
          ...item,
          path: item.uri,
          size: item.fileSize,
          type: item.mimeType,
          fileType: item.mimeType?.startsWith('video') ? 'video' : 'image',
        }))
      }
    }
    if (res.tempFilePath || (!!res.tempFilePaths && res.tempFilePaths.length > 0)) {
      return successHandler(success, complete)(res)
    } else {
      const res = {
        errMsg: `choose${messString}:fail cancel`
      }
      return errorHandler(fail, complete)(res)
    }
  } catch (err) {
    const res = {
      errMsg: `choose${messString}:fail`,
      err
    }
    return errorHandler(fail, complete)(res)
  }
}
