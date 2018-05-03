import { errorHandler, getParameterError } from './utils'
import Toast from './toast'
import Modal from './modal'
import ActionSheet from './actionSheet'

let status = 'default'

// inject necessary style
function init (doc) {
  console.log(status)
  if (status === 'ready') return

  const taroStyle = doc.createElement('style')
  taroStyle.textContent = '@font-face{font-weight:normal;font-style:normal;font-family:"taro";src:url("data:application/x-font-ttf;charset=utf-8;base64, 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") format("truetype");}@-webkit-keyframes taroLoading{0%{-webkit-transform:rotate3d(0, 0, 1, 0deg);}100%{-webkit-transform:rotate3d(0, 0, 1, 360deg);transform:rotate3d(0, 0, 1, 360deg);}}@keyframes taroLoading{0%{-webkit-transform:rotate3d(0, 0, 1, 0deg);}100%{-webkit-transform:rotate3d(0, 0, 1, 360deg);transform:rotate3d(0, 0, 1, 360deg);}}.taro-modal__foot:after {content: "";position: absolute;left: 0;top: 0;right: 0;height: 1px;border-top: 1px solid #D5D5D6;color: #D5D5D6;-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);} .taro-model__btn:active {background-color: #EEEEEE}.taro-model__btn:not(:first-child):after {content: "";position: absolute;left: 0;top: 0;width: 1px;bottom: 0;border-left: 1px solid #D5D5D6;color: #D5D5D6;-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleX(0.5);transform: scaleX(0.5);}.taro-actionsheet__cell:not(:first-child):after {content: "";position: absolute;left: 0;top: 0;right: 0;height: 1px;border-top: 1px solid #e5e5e5;color: #e5e5e5;-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);}'
  doc.querySelector('head').appendChild(taroStyle)

  status = 'ready'
}

const toast = new Toast()
const modal = new Modal()
const actionSheet = new ActionSheet()

function showToast (options = {}) {
  init(document)

  const _default = {
    title: '',
    icon: 'success',
    image: '',
    duration: 1500,
    mask: false
  }
  options = Object.assign({}, _default, options)
  options._type = 'toast'

  // verify options
  if (typeof options.title !== 'string') {
    const err = { errMsg: getParameterError('showToast', 'title', 'String', typeof options.title) }
    options.fail && options.fail(err)
    options.complete && options.complete(err)
    return
  }

  if (options.hasOwnProperty('duration') && typeof options.duration !== 'number') {
    const err = { errMsg: getParameterError('showToast', 'duration', 'Number', typeof options.duration) }
    options.fail && options.fail(err)
    options.complete && options.complete(err)
    return
  }

  if (options.image && typeof options.image !== 'string') options.image = ''

  options.mask = !!options.mask

  if (!toast.el) return toast.create(options)
  toast.show(options)
}

function hideToast () {
  if (!toast.el) return
  toast.hide(0, 'toast')
}

function showLoading (options = {}) {
  init(document)

  const _default = {
    title: '',
    mask: false
  }
  const config = {
    icon: 'loading',
    image: '',
    duration: -1
  }

  options = Object.assign({}, _default, options, config)
  options._type = 'loading'

  // verify options
  if (typeof options.title !== 'string') {
    const err = { errMsg: getParameterError('showLoading', 'title', 'String', typeof options.title) }
    options.fail && options.fail(err)
    options.complete && options.complete(err)
    return
  }

  options.mask = !!options.mask

  if (!toast.el) return toast.create(options)
  toast.show(options)
}

function hideLoading () {
  if (!toast.el) return
  toast.hide(0, 'loading')
}

function showModal (options = {}) {
  init(document)

  const _default = {
    title: '',
    content: '',
    showCancel: true,
    cancelText: '取消',
    cancelColor: '#000000',
    confirmText: '确定',
    confirmColor: '#3CC51F'
  }
  options = Object.assign({}, _default, options)

  // verify options
  const handler = errorHandler(options.fail, options.complete)

  if (typeof options.title !== 'string') {
    handler({errMsg: getParameterError('showModal', 'title', 'String', typeof options.title)})
    return
  }

  if (typeof options.content !== 'string') {
    handler({errMsg: getParameterError('showModal', 'content', 'String', typeof options.content)})
    return
  }

  if (typeof options.cancelText !== 'string') {
    handler({errMsg: getParameterError('showModal', 'cancelText', 'String', typeof options.cancelText)})
    return
  }

  if (options.cancelText.length > 4) {
    handler({errMsg: 'showModal: fail cancelText length should not large then 4'})
    return
  }

  if (typeof options.confirmText !== 'string') {
    handler({errMsg: getParameterError('showModal', 'confirmText', 'String', typeof options.confirmText)})
    return
  }

  if (options.confirmText.length > 4) {
    handler({errMsg: 'showModal: fail confirmText length should not large then 4'})
    return
  }

  if (typeof options.cancelColor !== 'string') {
    handler({errMsg: getParameterError('showModal', 'cancelColor', 'String', typeof options.cancelColor)})
    return
  }

  if (typeof options.confirmColor !== 'string') {
    handler({errMsg: getParameterError('showModal', 'confirmColor', 'String', typeof options.confirmColor)})
    return
  }

  options.showCancel = !!options.showCancel

  if (!modal.el) return modal.create(options)
  modal.show(options)
}

function showActionSheet (options = {}) {
  init(document)

  const _default = {
    itemColor: '#000000'
  }
  options = Object.assign({}, _default, options)

  // verify options
  const handler = errorHandler(options.fail, options.complete)

  // list item String
  if (!Array.isArray(options.itemList)) {
    handler({errMsg: getParameterError('showActionSheet', 'itemList', 'Array', typeof options.itemList)})
    return
  }

  if (options.itemList.length < 1) {
    handler({errMsg: 'showActionSheet:fail parameter error:parameter.itemList should have at least 1 item'})
    return
  }

  if (options.itemList.length > 6) {
    handler({errMsg: 'showActionSheet:fail parameter error:parameter.itemList should not be large than 6'})
    return
  }

  for (let i = 0; i < options.itemList.length; i++) {
    if (typeof options.itemList[i] !== 'string') {
      handler({errMsg: getParameterError('showActionSheet', `itemList[${i}]`, 'String', typeof options.itemList[i])})
      return
    }
  }

  if (typeof options.itemColor !== 'string') {
    handler({errMsg: getParameterError('showActionSheet', 'itemColor', 'String', typeof options.itemColor)})
    return
  }

  if (!actionSheet.el) return actionSheet.create(options)
  actionSheet.show(options)
}

export { showToast, hideToast, showLoading, hideLoading, showModal, showActionSheet }
