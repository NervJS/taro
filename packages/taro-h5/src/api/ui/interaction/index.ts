import Taro from '@tarojs/api'
import { Current } from '@tarojs/runtime'

import { getParameterError, temporarilyNotSupport } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'
import ActionSheet from './actionSheet'
import Modal from './modal'
import Toast from './toast'

// 交互

let status = 'default'

// inject necessary style
function init (doc) {
  if (status === 'ready') return

  const taroStyle = doc.createElement('style')
  taroStyle.textContent =
    '@font-face{font-weight:normal;font-style:normal;font-family:"taro";src:url("data:application/x-font-ttf;charset=utf-8;base64, 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") format("truetype");}@-webkit-keyframes taroLoading{0%{-webkit-transform:rotate3d(0, 0, 1, 0deg);}100%{-webkit-transform:rotate3d(0, 0, 1, 360deg);transform:rotate3d(0, 0, 1, 360deg);}}@keyframes taroLoading{0%{-webkit-transform:rotate3d(0, 0, 1, 0deg);}100%{-webkit-transform:rotate3d(0, 0, 1, 360deg);transform:rotate3d(0, 0, 1, 360deg);}}.taro-modal__foot:after {content: "";position: absolute;left: 0;top: 0;right: 0;height: 1px;border-top: 1px solid #D5D5D6;color: #D5D5D6;-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);} .taro-model__btn:active {background-color: #EEEEEE}.taro-model__btn:not(:first-child):after {content: "";position: absolute;left: 0;top: 0;width: 1px;bottom: 0;border-left: 1px solid #D5D5D6;color: #D5D5D6;-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleX(0.5);transform: scaleX(0.5);}.taro-actionsheet__cell:not(:last-child):after {content: "";position: absolute;left: 0;bottom: 0;right: 0;height: 1px;border-top: 1px solid #e5e5e5;color: #e5e5e5;-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);}'
  doc.querySelector('head').appendChild(taroStyle)

  status = 'ready'
}

const toast = new Toast()
const modal = new Modal()
const actionSheet = new ActionSheet()

const showToast: typeof Taro.showToast = (options = { title: '' }) => {
  init(document)
  options = Object.assign({
    title: '',
    icon: 'success',
    image: '',
    duration: 1500,
    mask: false
  }, options)
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name: 'showToast', success, fail, complete })

  if (typeof options.title !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'title',
        correct: 'String',
        wrong: options.title
      })
    })
  }

  if (typeof options.duration !== 'number') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'duration',
        correct: 'Number',
        wrong: options.duration
      })
    })
  }

  if (options.image && typeof options.image !== 'string') options.image = ''

  options.mask = !!options.mask

  let errMsg = ''
  if (!toast.el) {
    errMsg = toast.create(options, 'toast')
  } else {
    errMsg = toast.show(options, 'toast')
  }
  return handle.success({ errMsg })
}

const hideToast: typeof Taro.hideToast = ({ noConflict = false, success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'hideToast', success, fail, complete })
  if (!toast.el) return handle.success()
  toast.hide(0, noConflict ? 'toast' : '')
  return handle.success()
}

const showLoading: typeof Taro.showLoading = (options = { title: '' }) => {
  init(document)
  options = Object.assign({
    title: '',
    mask: false
  }, options)
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name: 'showLoading', success, fail, complete })

  const config = {
    icon: 'loading',
    image: '',
    duration: -1
  }

  options = Object.assign({}, options, config)

  if (typeof options.title !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'title',
        correct: 'String',
        wrong: options.title
      })
    })
  }

  options.mask = !!options.mask

  let errMsg = ''
  if (!toast.el) {
    errMsg = toast.create(options, 'loading')
  } else {
    errMsg = toast.show(options, 'loading')
  }
  return handle.success({ errMsg })
}

const hideLoading: typeof Taro.hideLoading = ({ noConflict = false, success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'hideLoading', success, fail, complete })
  if (!toast.el) return handle.success()
  toast.hide(0, noConflict ? 'loading' : '')
  return handle.success()
}

const showModal: typeof Taro.showModal = async (options = {}) => {
  init(document)
  options = Object.assign({
    title: '',
    content: '',
    showCancel: true,
    cancelText: '取消',
    cancelColor: '#000000',
    confirmText: '确定',
    confirmColor: '#3CC51F'
  }, options)
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name: 'showModal', success, fail, complete })

  if (typeof options.title !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'title',
        correct: 'String',
        wrong: options.title
      })
    })
  }

  if (typeof options.content !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'content',
        correct: 'String',
        wrong: options.content
      })
    })
  }

  if (typeof options.cancelText !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'cancelText',
        correct: 'String',
        wrong: options.cancelText
      })
    })
  }

  if (options.cancelText.replace(/[\u0391-\uFFE5]/g, 'aa').length > 8) {
    return handle.fail({
      errMsg: 'cancelText length should not larger then 4 Chinese characters'
    })
  }

  if (typeof options.confirmText !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'confirmText',
        correct: 'String',
        wrong: options.confirmText
      })
    })
  }

  if (options.confirmText.replace(/[\u0391-\uFFE5]/g, 'aa').length > 8) {
    return handle.fail({
      errMsg: 'confirmText length should not larger then 4 Chinese characters'
    })
  }

  if (typeof options.cancelColor !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'cancelColor',
        correct: 'String',
        wrong: options.cancelColor
      })
    })
  }

  if (typeof options.confirmColor !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'confirmColor',
        correct: 'String',
        wrong: options.confirmColor
      })
    })
  }

  options.showCancel = !!options.showCancel

  let result = ''
  if (!modal.el) {
    result = await modal.create(options)
  } else {
    result = await modal.show(options)
  }
  const res = { cancel: !1, confirm: !1 }
  res[result] = !0
  return handle.success(res)
}

function hideModal () {
  if (!modal.el) return
  modal.hide()
}

const showActionSheet = async (
  options: Taro.showActionSheet.Option = { itemList: [] },
  methodName = 'showActionSheet'
): Promise<Taro.showActionSheet.SuccessCallbackResult> => {
  init(document)
  options = Object.assign({
    itemColor: '#000000',
    itemList: []
  }, options)
  const { success, fail, complete } = options
  const handle = new MethodHandler<Taro.showActionSheet.SuccessCallbackResult>({ name: methodName, success, fail, complete })

  // list item String
  if (!Array.isArray(options.itemList)) {
    return handle.fail({
      errMsg: getParameterError({
        para: 'itemList',
        correct: 'Array',
        wrong: options.itemList
      })
    })
  }

  if (options.itemList.length < 1) {
    return handle.fail({ errMsg: 'parameter error: parameter.itemList should have at least 1 item' })
  }

  if (options.itemList.length > 6) {
    return handle.fail({ errMsg: 'parameter error: parameter.itemList should not be large than 6' })
  }

  for (let i = 0; i < options.itemList.length; i++) {
    if (typeof options.itemList[i] !== 'string') {
      return handle.fail({
        errMsg: getParameterError({
          para: `itemList[${i}]`,
          correct: 'String',
          wrong: options.itemList[i]
        })
      })
    }
  }

  if (typeof options.itemColor !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'itemColor',
        correct: 'String',
        wrong: options.itemColor
      })
    })
  }

  let result: number | string = ''
  if (!actionSheet.el) {
    result = await actionSheet.create(options)
  } else {
    result = await actionSheet.show(options)
  }

  if (typeof result === 'string') {
    return handle.fail(({ errMsg: result }))
  } else {
    return handle.success(({ tapIndex: result }))
  }
}

Taro.eventCenter.on('__afterTaroRouterChange', () => {
  if (toast.currentPath && toast.currentPath !== Current.page?.path) {
    if (Taro.getEnv() !== Taro.ENV_TYPE.MPHARMONY) {
      hideToast()
      hideLoading()
    }
  }

  if (modal.currentPath && modal.currentPath !== Current.page?.path) {
    if (Taro.getEnv() !== Taro.ENV_TYPE.MPHARMONY) {
      hideModal()
    }
  }
})

const enableAlertBeforeUnload = /* @__PURE__ */ temporarilyNotSupport('enableAlertBeforeUnload')
const disableAlertBeforeUnload = /* @__PURE__ */ temporarilyNotSupport('disableAlertBeforeUnload')

export { disableAlertBeforeUnload, enableAlertBeforeUnload, hideLoading, hideToast, showActionSheet, showLoading, showModal, showToast }
