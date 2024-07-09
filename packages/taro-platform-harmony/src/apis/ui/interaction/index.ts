// @ts-ignore
import { Current } from '@tarojs/runtime'

import { callAsyncFail, callAsyncSuccess, temporarilyNotSupport, validateParams } from '../../utils'

const resCallback = (res) => {
  return { errMsg: `${res}:ok` }
}

const showToastSchema = {
  title: 'String',
  duration: 'Number',
  bottom: 'String'
}

export function showToast (options) {
  return new Promise((resolve, reject) => {
    const _default = {
      title: '',
      duration: 1500,
      bottom: '50%'
    }

    options = { ..._default, ...options }

    try {
      validateParams<any>('showToast', options, showToastSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }

    // @ts-ignore
    const uiContext = Current?.page?.getUIContext?.()

    if (!uiContext) return

    uiContext.getPromptAction().showToast({
      message: options.title,
      duration: options.duration,
      bottom: options.bottom,
      showMode: 1 // 设置弹窗显示模式，显示在应用之上。
    })
    callAsyncSuccess(resolve, resCallback('showToast'), options)
  })
}

export function showModal (options) {
  const _default = {
    title: '',
    content: '',
    showCancel: true,
    cancelText: '取消',
    cancelColor: '#000000',
    confirmText: '确定',
    confirmColor: '#3CC51F'
  }

  options = { ..._default, ...options }

  const {
    title, content, cancelText, confirmText,
    cancelColor, confirmColor, showCancel
  } = options

  const buttons: any = []

  if (cancelText !== '' && showCancel) {
    buttons.push({
      text: cancelText,
      color: cancelColor
    })
  }

  if (confirmText !== '') {
    buttons.push({
      text: confirmText,
      color: confirmColor
    })
  }

  return new Promise((resolve, reject) => {
    const modalOptions = {
      title,
      message: content,
      buttons: buttons,
    }

    // @ts-ignore
    const uiContext = Current?.page?.getUIContext?.()

    if (!uiContext) return

    uiContext.getPromptAction().showDialog(modalOptions, (error, data) => {
      if (error) {
        const res = { errMsg: error }
        callAsyncFail(reject, res, options)
      }

      if (data.index === 0 && showCancel) {
        callAsyncSuccess(
          resolve,
          {
            ...resCallback('showModal'),
            confirm: false,
            cancel: true
          },
          options
        )
      } else {
        callAsyncSuccess(
          resolve,
          {
            ...resCallback('showModal'),
            confirm: true,
            cancel: false,
            content: null
          },
          options
        )
      }
    })
  })
}

const showActionSheetSchema = {
  title: 'String',
  itemList: 'Array'
}

export function showActionSheet (options) {
  return new Promise((resolve, reject) => {
    const _default = {
      title: '',
      itemList: [],
      itemColor: '#000000'
    }

    options = { ..._default, ...options }

    try {
      validateParams<any>('showActionSheet', options, showActionSheetSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }

    const { title, itemList, itemColor } = options

    const buttons = itemList.map(res => {
      return {
        text: res,
        color: itemColor
      }
    })

    const actionSheetOptions = {
      title,
      buttons
    }

    // @ts-ignore
    const uiContext = Current?.page?.getUIContext?.()

    if (!uiContext) return

    uiContext.getPromptAction().showActionMenu(actionSheetOptions, (error, data) => {
      if (error) {
        callAsyncFail(
          reject,
          {
            ...data,
            errMsg: data.errMsg?.replace('showActionMenu', 'showActionSheet')
          },
          options
        )
      }

      callAsyncSuccess(
        resolve,
        {
          ...data,
          ...resCallback('showActionSheet')
        },
        options
      )
    })
  })
}

export const hideToast = /* @__PURE__ */ temporarilyNotSupport('hideToast')

export const showLoading = temporarilyNotSupport('showLoading')
export const hideLoading = temporarilyNotSupport('hideLoading')

export const enableAlertBeforeUnload = /* @__PURE__ */ temporarilyNotSupport('enableAlertBeforeUnload')
export const disableAlertBeforeUnload = /* @__PURE__ */ temporarilyNotSupport('disableAlertBeforeUnload')
