import { Image } from 'react-native'
import {chooseMedia} from './chooseMedia'
import {saveMedia} from './saveMedia'

/**
 * 从本地相册选择图片或使用相机拍照。
 * @param {Object} opts
 * @param {number} [opts.count=9] - ✖
 * @param {Array} [opts.sizeType=['original', 'compressed']] - 所选的图片的尺寸 ✔
 * @param {Array} [opts.sourceType=['album', 'camera']] - ✔
 * @returns {Promise<*>}
 */
export function chooseImage (opts) {
  return chooseMedia(opts, 'Images')
}

/**
 * 拍摄视频或从手机相册中选视频。
 * @param {Object} opts
 * @param {Array} [opts.sourceType=['album', 'camera']] ✔
 * @param {boolean} [opts.compressed=true] ✔
 * @param {number} [opts.maxDuration=60] - 拍摄视频最长拍摄时间，单位秒 ✖
 * @param {string} [opts.maxDuration='camera'] - 默认拉起的是前置或者后置摄像头。✖
 * @returns {Promise<*>}
 */
export function chooseVideo (opts) {
  return chooseMedia(opts, 'Videos')
}

/**
 * 获取图片信息。网络图片需先配置download域名才能生效。
 * @param opts
 * @param {string} opts.src 图片的路径，可以是相对路径、临时文件路径、存储文件路径、网络图片路径
 * @returns {Promise}
 */
export function getImageInfo (opts = {}) {
  const {src, success, fail, complete} = opts
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

/**
 * 保存图片到系统相册
 * @param opts
 * @param {string} opts.filePath  图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径
 * @returns {*}
 */
export function saveImageToPhotosAlbum (opts = {}) {
  return saveMedia(opts, 'photo', 'saveImageToPhotosAlbum')
}

/**
 * 保存视频到系统相册。支持mp4视频格式。
 * @param opts
 * @param {string} opts.filePath - 视频文件路径，可以是临时文件路径也可以是永久文件路径
 * @returns {Promise<*>}
 */
export function saveVideoToPhotosAlbum (opts = {}) {
  return saveMedia(opts, 'video', 'saveVideoToPhotosAlbum')
}

export {getRecorderManager} from './record'
export {createVideoContext} from './video'
export {createInnerAudioContext} from './audio'
export {createMapContext} from './map'
