import { CameraRoll } from "@react-native-camera-roll/camera-roll"
import { requestCameraPermissionsAsync } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import { successHandler, errorHandler } from '../utils'

export const MEDIA_TYPE = {
  VIDEOS: 'Videos',
  IMAGES: 'Images'
}

export async function saveMedia(opts: Taro.saveImageToPhotosAlbum.Option | Taro.saveVideoToPhotosAlbum.Option, type:string, API:string):Promise<TaroGeneral.CallbackResult> {
  const { filePath, success, fail, complete } = opts
  const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (!granted) {
    const res = { errMsg: 'Permissions denied!' }
    return errorHandler(fail, complete)(res)
  }

  const res: any = { errMsg: `${API}:ok` }
  const saveType = (type === 'video' || type === 'photo') ? type : 'auto'
  try {
    const url: string = await CameraRoll.save(filePath, { type: saveType })
    res.path = url;
    return successHandler(success, complete)(res)
  } catch (err) {
    res.errMsg = err.message
    return errorHandler(fail, complete)(res)
  }
}

export async function chooseMedia(opts: Taro.chooseImage.Option | Taro.chooseVideo.Option, mediaTypes: string): Promise<TaroGeneral.CallbackResult> {
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
  const { granted } = isCamera ? await requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (!granted) {
    const res = { errMsg: 'Permissions denied!' }
    return errorHandler(fail, complete)(res)
  }

  let launchMediaAsync = isCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync
  try {
    const resp: any = await launchMediaAsync(options as any)
    const { uri, duration, width, height } = resp
    resp.path = uri

    let res: any = {}
    if (mediaTypes === MEDIA_TYPE.VIDEOS) {
      res = {
        tempFilePath: uri,
        duration,
        width,
        height
      }
    } else {
      res = {
        tempFilePaths: [uri],
        tempFiles: [resp]
      }
    }
    if (res.tempFilePath || (!!res.tempFilePaths && res.tempFilePaths.length > 0)) {
      return successHandler(success, complete)(res)
    } else {
      const res = {
        errMsg: mediaTypes === MEDIA_TYPE.VIDEOS ? 'chooseVideo:fail cancel' : 'chooseImage:fail cancel',
      }
      return errorHandler(fail, complete)(res)
    }
  } catch (err) {
    const res = {
      errMsg: mediaTypes === MEDIA_TYPE.VIDEOS ? 'chooseVideo fail' : 'chooseImage fail',
      err
    }
    return errorHandler(fail, complete)(res)
  }
}
