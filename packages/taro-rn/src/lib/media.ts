import CameraRoll from '@react-native-community/cameraroll'
import { Permissions } from 'react-native-unimodules'
import * as ImagePicker from 'expo-image-picker'
import { askAsyncPermissions } from '../utils/premissions'

export const MEDIA_TYPE = {
  VIDEOS: 'Videos',
  IMAGES: 'Images'
}

export async function saveMedia(opts: Taro.saveImageToPhotosAlbum.Option|Taro.saveVideoToPhotosAlbum.Option, type:string, API:string):Promise<Taro.General.CallbackResult> {
  const status = await askAsyncPermissions(Permissions.CAMERA_ROLL)
  if (status !== 'granted') {
    const res = { errMsg: 'Permissions denied!' }
    return Promise.reject(res)
  }
  const { filePath, success, fail, complete } = opts
  const res: any = { errMsg: `${API}:ok` }
  const saveType = (type === 'video' || type === 'photo') ? type : 'auto'
  return CameraRoll.save(filePath, { type: saveType })
    .then((url) => {
      res.path = url
      success?.(res)
      complete?.(res)
      return Promise.resolve(res)
    }).catch((err) => {
      res.errMsg = err.message
      fail?.(res)
      complete?.(res)
      return Promise.reject(res)
    })
}

export async function chooseMedia(opts: Taro.chooseImage.Option|Taro.chooseVideo.Option, mediaTypes: string): Promise<Taro.General.CallbackResult> {
  if (!opts || typeof opts !== 'object') {
    opts = {}
  }
  const { sizeType = [], sourceType = [], success, fail, complete, maxDuration } = opts as any
  const options = {
    mediaTypes,
    quality: sizeType[0] === 'compressed' ? 0.7 : 1,
    videoMaxDuration: maxDuration
  }
  const isCamera = sourceType[0] === 'camera'
  const status = isCamera ? await askAsyncPermissions(Permissions.CAMERA) : await askAsyncPermissions(Permissions.CAMERA_ROLL)
  if (status !== 'granted') {
    const res = { errMsg: 'Permissions denied!' }
    return Promise.reject(res)
  }

  let p
  return new Promise((resolve, reject) => {
    p = isCamera ? ImagePicker.launchCameraAsync(options as any) : ImagePicker.launchImageLibraryAsync(options as any)
    p.then((resp) => {
      const { uri } = resp
      resp.path = uri
      let res = {
        tempFilePaths: [uri],
        tempFiles: [resp]
      }
      if (mediaTypes === MEDIA_TYPE.VIDEOS) {
        res = Object.assign(res, { tempFilePath: uri })
      }
      success?.(res)
      complete?.(res)
      resolve(res as any)
    }).catch((err) => {
      const res = {
        errMsg: mediaTypes === MEDIA_TYPE.VIDEOS ? 'chooseVideo fail' : 'chooseImage fail',
        err
      }
      fail?.(res)
      complete?.(res)
      reject(res)
    })
  })
}
