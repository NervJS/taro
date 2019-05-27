import Nerv, { unmountComponentAtNode } from 'nervjs'
import Previewer from './react-wx-images-viewer/index'

/**
 * 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
 * @param {Object} object
 * @param {Array.<string>} object.urls 需要预览的图片链接列表。2.2.3 起支持云文件ID。
 * @param {string} [object.current=object.urls[0]]  urls的第一张 当前显示图片的链接
 * @param {function} [object.success] 接口调用成功的回调函数
 * @param {function} [object.fail] 接口调用失败的回调函数
 * @param {function} [object.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
const previewImage = ({ urls, current, success, fail, complete } = {}) => {
  const div = document.createElement('div')
  const currentIndex = urls.reduce((prev, curr, index) => curr === current ? index : prev, -1)
  const onSuccess = res => {
    success && success(res)
    complete && complete()
    Promise.resolve(res)
  }
  const onError = res => {
    fail && fail(res)
    complete && complete()
    Promise.reject(res)
  }
  const props = {
    urls,
    onClose () {
      unmountComponentAtNode(div)
    }
  }
  if (currentIndex > -1) {
    props.index = currentIndex
  }
  Nerv.render(<Previewer {...props} />, div)
  return onSuccess({ errMsg: 'previewImage:ok' })
}

export default previewImage
