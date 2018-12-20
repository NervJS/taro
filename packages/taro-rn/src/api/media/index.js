import { CameraRoll, Image } from 'react-native'
import { ImagePicker, Permissions } from 'expo'
import { askAsyncPermissions } from '../utils'

export function chooseImage (opts) {
  return chooseMedia(opts, 'Images')
}

export function chooseVideo (opts) {
  return chooseMedia(opts, 'Videos')
}

async function chooseMedia (opts, mediaTypes) {
  if (!opts || typeof opts !== 'object') {
    opts = {}
  }
  const { sizeType = [], sourceType = [], success, fail, complete } = opts
  const options = {
    mediaTypes,
    quality: sizeType[0] === 'compressed' ? 0.7 : 1
  }
  const isCamera = sourceType[0] === 'camera'
  const status = isCamera ? await askAsyncPermissions(Permissions.CAMERA) : await askAsyncPermissions(Permissions.CAMERA_ROLL)
  if (status !== 'granted') {
    const res = { errMsg: `Permissions denied!` }
    return Promise.reject(res)
  }

  let p
  return new Promise((resolve, reject) => {
    p = isCamera ? ImagePicker.launchCameraAsync(options) : ImagePicker.launchImageLibraryAsync(options)
    p.then((resp) => {
      const { uri } = resp
      resp.path = uri
      const res = {
        tempFilePaths: [uri],
        tempFiles: [resp]
      }
      success && success(res)
      complete && complete(res)
      resolve(res)
    }).catch((err) => {
      const res = {
        errMsg: `chooseImage fail`,
        err
      }
      fail && fail(res)
      complete && complete(res)
      reject(res)
    })
  })
}

export function getImageInfo (opts = {}) {
  const { src, success, fail, complete } = opts
  const res = {}

  return new Promise((resolve, reject) => {
    Image.getSize(
      src,
      (width, height) => {
        res.width = width
        res.height = height
        res.path = src
        res.orientation = null
        res.type = null

        success && success(res)
        complete && complete(res)
        resolve(res)
      },
      (err) => {
        res.errMsg = err.message
        fail && fail(res)
        complete && complete(res)
        reject(res)
      }
    )
  })
}

function saveMedia (opts, type, API) {
  const { filePath, success, fail, complete } = opts
  const res = { errMsg: `${API}:ok` }

  return CameraRoll.saveToCameraRoll(filePath, type)
    .then((url) => {
      res.path = url
      success && success(res)
      complete && complete(res)
      return Promise.resolve(res)
    }).catch((err) => {
      res.errMsg = err.message
      fail && fail(res)
      complete && complete(res)
      return Promise.reject(res)
    })
}

export function saveImageToPhotosAlbum (opts = {}) {
  return saveMedia(opts, 'photo', 'saveImageToPhotosAlbum')
}

export function saveVideoToPhotosAlbum (opts = {}) {
  return saveMedia(opts, 'video', 'saveVideoToPhotosAlbum')
}

export default {
  chooseImage,
  chooseVideo,
  getImageInfo,
  saveImageToPhotosAlbum,
  saveVideoToPhotosAlbum
}
