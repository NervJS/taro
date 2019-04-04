import { errorHandler, getParameterError } from '../utils'
import Toast from './toast'
import Modal from './modal'
import ActionSheet from './actionSheet'
import Taro from '../../taro'

let status = 'default'

// inject necessary style
function init (doc) {
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
  const handler = errorHandler(options.fail, options.complete)

  if (typeof options.title !== 'string') {
    return handler({
      errMsg: getParameterError({
        name: 'showToast',
        para: 'title',
        correct: 'String',
        wrong: options.title
      })
    })
  }

  if (typeof options.duration !== 'number') {
    return handler({
      errMsg: getParameterError({
        name: 'showToast',
        para: 'duration',
        correct: 'Number',
        wrong: options.duration
      })
    })
  }

  if (options.image && typeof options.image !== 'string') options.image = ''

  options.mask = !!options.mask

  if (!toast.el) return toast.create(options)
  return toast.show(options)
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
  const handler = errorHandler(options.fail, options.complete)

  if (typeof options.title !== 'string') {
    return handler({
      errMsg: getParameterError({
        name: 'showLoading',
        para: 'title',
        correct: 'String',
        wrong: options.title
      })
    })
  }

  options.mask = !!options.mask

  if (!toast.el) return toast.create(options)
  return toast.show(options)
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
    return handler({
      errMsg: getParameterError({
        name: 'showModal',
        para: 'title',
        correct: 'String',
        wrong: options.title
      })
    })
  }

  if (typeof options.content !== 'string') {
    return handler({
      errMsg: getParameterError({
        name: 'showModal',
        para: 'content',
        correct: 'String',
        wrong: options.content
      })
    })
  }

  if (typeof options.cancelText !== 'string') {
    return handler({
      errMsg: getParameterError({
        name: 'showModal',
        para: 'cancelText',
        correct: 'String',
        wrong: options.cancelText
      })
    })
  }

  if (options.cancelText.replace(/[\u0391-\uFFE5]/g, 'aa').length > 8) {
    return handler({ errMsg: 'showModal:fail cancelText length should not larger then 4 Chinese characters' })
  }

  if (typeof options.confirmText !== 'string') {
    return handler({
      errMsg: getParameterError({
        name: 'showModal',
        para: 'confirmText',
        correct: 'String',
        wrong: options.confirmText
      })
    })
  }

  if (options.confirmText.replace(/[\u0391-\uFFE5]/g, 'aa').length > 8) {
    return handler({ errMsg: 'showModal:fail confirmText length should not larger then 4 Chinese characters' })
  }

  if (typeof options.cancelColor !== 'string') {
    return handler({
      errMsg: getParameterError({
        name: 'showModal',
        para: 'cancelColor',
        correct: 'String',
        wrong: options.cancelColor
      })
    })
  }

  if (typeof options.confirmColor !== 'string') {
    return handler({
      errMsg: getParameterError({
        name: 'showModal',
        para: 'confirmColor',
        correct: 'String',
        wrong: options.confirmColor
      })
    })
  }

  options.showCancel = !!options.showCancel

  if (!modal.el) return modal.create(options)
  return modal.show(options)
}

function hideModal () {
  if (!modal.el) return
  modal.hide()
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
    return handler({
      errMsg: getParameterError({
        name: 'showActionSheet',
        para: 'itemList',
        correct: 'Array',
        wrong: options.itemList
      })
    })
  }

  if (options.itemList.length < 1) {
    return handler({ errMsg: 'showActionSheet:fail parameter error: parameter.itemList should have at least 1 item' })
  }

  if (options.itemList.length > 6) {
    return handler({ errMsg: 'showActionSheet:fail parameter error: parameter.itemList should not be large than 6' })
  }

  for (let i = 0; i < options.itemList.length; i++) {
    if (typeof options.itemList[i] !== 'string') {
      return handler({
        errMsg: getParameterError({
          name: 'showActionSheet',
          para: `itemList[${i}]`,
          correct: 'String',
          wrong: options.itemList[i]
        })
      })
    }
  }

  if (typeof options.itemColor !== 'string') {
    return handler({
      errMsg: getParameterError({
        name: 'showActionSheet',
        para: 'itemColor',
        correct: 'String',
        wrong: options.itemColor
      })
    })
  }

  if (!actionSheet.el) return actionSheet.create(options)
  return actionSheet.show(options)
}

Taro.eventCenter.on('__taroRouterChange', () => {
  hideToast()
  hideLoading()
  hideModal()
})

export { showToast, hideToast, showLoading, hideLoading, showModal, showActionSheet }
