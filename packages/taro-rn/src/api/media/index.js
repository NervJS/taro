import { CameraRoll, Image } from 'react-native'

export function chooseImage () {
  throw new Error('暂不支持chooseImage API')
}

export function chooseVideo () {
  throw new Error('暂不支持chooseVideo API')
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

export function previewImage (opts = {}) {
  // to do...
}

export default {
  chooseImage,
  chooseVideo,
  getImageInfo,
  saveImageToPhotosAlbum,
  saveVideoToPhotosAlbum,
  previewImage
}
