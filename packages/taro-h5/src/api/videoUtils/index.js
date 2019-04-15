import { findDOMNode } from 'nervjs'
import { shouleBeObject, getParameterError, findRef } from '../utils'

// export function chooseVideo (options) {
//   // options must be an Object
//   const isObject = shouleBeObject(options)
//   if (!isObject.res) {
//     const res = { errMsg: `chooseVideo${isObject.msg}` }
//     console.error(res.errMsg)
//     return Promise.reject(res)
//   }

//   const { count = 1, success, fail, complete } = options
//   const res = {
//     errMsg: 'chooseVideo:ok',
//     tempFilePaths: [],
//     tempFiles: []
//   }

//   if (count && typeof count !== 'number') {
//     res.errMsg = getParameterError({
//       name: 'chooseVideo',
//       para: 'count',
//       correct: 'Number',
//       wrong: count
//     })
//     console.error(res.errMsg)
//     typeof fail === 'function' && fail(res)
//     typeof complete === 'function' && complete(res)
//     return Promise.reject(res)
//   }

//   let taroChooseVideo = document.createElement('input')
//   obj.setAttribute('type', 'file')
//   obj.setAttribute('multiple', 'multiple')
//   obj.setAttribute('accept', 'video/*')
//   obj.setAttribute('style', 'position: fixed; top: -4000px; left: -3000px; z-index: -300;')
//   document.body.appendChild(obj)

//   let taroChooseVideoCallback
//   const taroChooseVideoPromise = new Promise(resolve => {
//     taroChooseVideoCallback = resolve
//   })
//   let TaroMouseEvents = document.createEvent('MouseEvents')
//   TaroMouseEvents.initEvent('click', true, true)
//   taroChooseVideoId.dispatchEvent(TaroMouseEvents)
//   taroChooseVideoId.onchange = function (e) {
//     let arr = Array.from(e.target.files)
//     arr && arr.forEach(item => {
//       let blob = new Blob([item])
//       let url = URL.createObjectURL(blob)
//       res.tempFilePaths.push(url)
//       res.tempFiles.push({path: url, size: item.size, type: item.type})
//     })
//     typeof success === 'function' && success(res)
//     typeof complete === 'function' && complete(res)
//     taroChooseVideoCallback(res)
//   }
//   taroChooseVideoPromise.finally(() => {
//     document.body.removeChild(taroChooseVideo)
//   })
//   return taroChooseVideoPromise
// }

export function createVideoContext (id, componentInstance) {
  const refId = `__taroref_${id}`
  return findRef(refId, componentInstance)
}
