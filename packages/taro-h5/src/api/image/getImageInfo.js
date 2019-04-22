// const ORIENTATION_MAP = {
//   // up 默认方向（手机横持拍照），对应 Exif 中的 1。或无 orientation 信息。
//   1: 'up',

//   // up-mirrored 同 up，但镜像翻转，对应 Exif 中的 2
//   2: 'up-mirrored',

//   // down 旋转180度，对应 Exif 中的 3
//   3: 'down',

//   // down-mirrored 同 down，但镜像翻转，对应 Exif 中的 4
//   4: 'down-mirrored',

//   // left-mirrored 同 left，但镜像翻转，对应 Exif 中的 5
//   5: 'left-mirrored',

//   // right 顺时针旋转90度，对应 Exif 中的 6
//   6: 'right',

//   // right-mirrored 同 right，但镜像翻转，对应 Exif 中的 7
//   7: 'right-mirrored',

//   // left 逆时针旋转90度，对应 Exif 中的 8
//   8: 'left'
// }

/**
 * @typedef {'up'|'up-mirrored'|'down'|'down-mirrored'|'left-mirrored'|'right'|'right-mirrored'|'left'} Orientation
 * @typedef ImageInfo object.success 回调函数的参数
 * @property {number} width 图片原始宽度，单位px。不考虑旋转。
 * @property {number} height 图片原始高度，单位px。不考虑旋转。
 * @property {string} path 图片的本地路径
 * @property {Orientation} orientation 拍照时设备方向
 * @property {string} type 图片格式
 */

/**
 * 获取图片信息。网络图片需先配置download域名才能生效。
 * @param {Object} object 参数
 * @param {string} object.src 图片的路径，可以是相对路径、临时文件路径、存储文件路径、网络图片路径
 * @param {(res: ImageInfo) => void} [object.success] 接口调用成功的回调函数
 * @param {function} [object.fail] 接口调用失败的回调函数
 * @param {function} [object.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
const getImageInfo = ({ src, success, fail, complete } = {}) => {
  return new Promise((resolve, reject) => {
    const onSuccess = res => {
      success && success(res)
      complete && complete()
      resolve(res)
    }
    const onError = res => {
      fail && fail(res)
      complete && complete()
      reject(res)
    }
    const image = new Image()
    image.onload = () => {
      onSuccess({
        errMsg: 'getImageInfo:ok',
        width: image.naturalWidth,
        height: image.naturalHeight
      })
    }
    image.onerror = e => {
      onError({
        errMsg: `getImageInfo:fail ${e.message}`
      })
    }
    image.src = src
  })
}

export default getImageInfo
