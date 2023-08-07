import prompt from '@system.prompt'

import { callAsyncFail, callAsyncSuccess, unsupport, validateParams } from '../utils'

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
      bottom: '100px'
    }

    options = { ..._default, ...options }

    try {
      validateParams<any>('showToast', options, showToastSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }

    prompt.showToast({
      message: options.title,
      duration: options.duration,
      bottom: options.bottom
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

  return new Promise(resolve => {
    const modalOptions = {
      title,
      message: content,
      buttons: buttons,
      success: (data) => {
        if (data.index === 1 || !showCancel) {
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
        } else {
          callAsyncSuccess(
            resolve,
            {
              ...resCallback('showModal'),
              confirm: false,
              cancel: true
            },
            options
          )
        }
      },
      // 鸿蒙没有失败方法，只有取消
      cancel: (_) => {
        callAsyncSuccess(
          resolve,
          {
            ...resCallback('showModal'),
            confirm: false,
            cancel: true
          },
          options
        )
      }
    }

    prompt.showDialog(modalOptions)
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
      buttons,
      success: (data) => {
        callAsyncSuccess(
          resolve,
          {
            ...data,
            ...resCallback('showActionSheet')
          },
          options
        )
      },
      // 取消方法，并非失败
      fail: (data) => {
        callAsyncFail(
          reject,
          {
            ...data,
            errMsg: data.errMsg.replace('showActionMenu', 'showActionSheet')
          },
          options
        )
      }
    }

    prompt.showActionMenu(actionSheetOptions)
  })
}

export function hideToast (options) {
  return new Promise(resolve => {
    prompt.showToast({
      message: '关闭中',
      duration: 10,
      bottom: '9999px'
    })
    callAsyncSuccess(resolve, resCallback('hideToast'), options)
  })
}

export function showLoading () {
  process.env.NODE_ENV !== 'production' && unsupport('showLoading')
}

export function hideLoading () {
  process.env.NODE_ENV !== 'production' && unsupport('hideLoading')
}
