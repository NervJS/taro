import { shouldBeObject, getParameterError, findDOM } from '../../utils/odd'

/**
 * 拍摄视频或从手机相册中选视频。
 * @param {ChooseVideoParam} options
 */
export function chooseVideo (options) {
  // options must be an Object

  const isObject = shouldBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `chooseVideo:fail ${isObject.msg}` }
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
