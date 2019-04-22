import { shouleBeObject, getParameterError } from '../utils'

export default function chooseImage (options) {
  // options must be an Object
  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `chooseImage${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { count = 1, success, fail, complete } = options
  const res = {
    errMsg: 'chooseImage:ok',
    tempFilePaths: [],
    tempFiles: []
  }

  if (count && typeof count !== 'number') {
    res.errMsg = getParameterError({
      name: 'chooseImage',
      para: 'count',
      correct: 'Number',
      wrong: count
    })
    console.error(res.errMsg)
    typeof fail === 'function' && fail(res)
    typeof complete === 'function' && complete(res)
    return Promise.reject(res)
  }

  let taroChooseImageId = document.getElementById('taroChooseImage')
  if (!taroChooseImageId) {
    let obj = document.createElement('input')
    obj.setAttribute('type', 'file')
    obj.setAttribute('id', 'taroChooseImage')
    obj.setAttribute('multiple', 'multiple')
    obj.setAttribute('accept', 'image/*')
    obj.setAttribute('style', 'position: fixed; top: -4000px; left: -3000px; z-index: -300;')
    document.body.appendChild(obj)
    taroChooseImageId = document.getElementById('taroChooseImage')
  }
  let taroChooseImageCallback
  const taroChooseImagePromise = new Promise(resolve => {
    taroChooseImageCallback = resolve
  })
  let TaroMouseEvents = document.createEvent('MouseEvents')
  TaroMouseEvents.initEvent('click', true, true)
  taroChooseImageId.dispatchEvent(TaroMouseEvents)
  taroChooseImageId.onchange = function (e) {
    let arr = Array.from(e.target.files)
    arr && arr.forEach(item => {
      let blob = new Blob([item])
      let url = URL.createObjectURL(blob)
      res.tempFilePaths.push(url)
      res.tempFiles.push({path: url, size: item.size, type: item.type})
    })
    typeof success === 'function' && success(res)
    typeof complete === 'function' && complete(res)
    taroChooseImageCallback(res)
  }
  return taroChooseImagePromise
}
