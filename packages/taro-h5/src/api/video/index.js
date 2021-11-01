import { shouleBeObject, getParameterError, findDOM } from '../utils'

/**
 * @typedef {Object} ChooseVideoParam
 * @property {Array.<string>} [sourceType=['album', 'camera']] 视频选择的来源
 * @property {boolean} [compressed=true] 是否压缩所选择的视频文件
 * @property {number} [maxDuration=60] 拍摄视频最长拍摄时间，单位秒
 * @property {string} [camera=back] 默认拉起的是前置或者后置摄像头。部分 Android 手机下由于系统 ROM 不支持无法生效
 * @property {function} [success] 接口调用成功的回调函数
 * @property {function} [fail] 接口调用失败的回调函数
 * @property {function} [complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */

/**
 * 拍摄视频或从手机相册中选视频。
 * @param {ChooseVideoParam} options
 */
export function chooseVideo (options) {
  // options must be an Object

  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `chooseVideo${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { count = 1, success, fail, complete } = options
  const res = {
    errMsg: 'chooseVideo:ok',
    tempFilePaths: [],
    tempFiles: []
  }

  if (count && typeof count !== 'number') {
    res.errMsg = getParameterError({
      name: 'chooseVideo',
      para: 'count',
      correct: 'Number',
      wrong: count
    })
    console.error(res.errMsg)
    typeof fail === 'function' && fail(res)
    typeof complete === 'function' && complete(res)
    return Promise.reject(res)
  }

  const taroChooseVideo = document.createElement('input')
  taroChooseVideo.setAttribute('type', 'file')
  taroChooseVideo.setAttribute('multiple', 'multiple')
  taroChooseVideo.setAttribute('accept', 'video/*')
  taroChooseVideo.setAttribute('style', 'position: fixed; top: -4000px; left: -3000px; z-index: -300;')
  document.body.appendChild(taroChooseVideo)

  let taroChooseVideoCallback
  const taroChooseVideoPromise = new Promise(resolve => {
    taroChooseVideoCallback = resolve
  })
  const TaroMouseEvents = document.createEvent('MouseEvents')
  TaroMouseEvents.initEvent('click', true, true)
  taroChooseVideo.dispatchEvent(TaroMouseEvents)
  taroChooseVideo.onchange = function (e) {
    const arr = [...e.target.files]
    arr && arr.forEach(item => {
      const blob = new Blob([item])
      const url = URL.createObjectURL(blob)
      res.tempFilePaths.push(url)
      res.tempFiles.push({ path: url, size: item.size, type: item.type })
    })
    typeof success === 'function' && success(res)
    typeof complete === 'function' && complete(res)
    taroChooseVideoCallback(res)
  }
  taroChooseVideoPromise.finally(() => {
    document.body.removeChild(taroChooseVideo)
  })
  return taroChooseVideoPromise
}

/**
 * 创建 video 上下文 VideoContext 对象。
 * @param {string} id <video> 组件的 id
 */
export function createVideoContext (id, inst) {
  /** @type {HTMLVideoElement} */
  return findDOM(inst).querySelector(`taro-video-core[id=${id}]`)
}
