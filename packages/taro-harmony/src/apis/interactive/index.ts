import { isString, isNumber, isArray } from '@tarojs/shared'
import {
  getParameterError, unsupport, callAsyncSuccess, callAsyncFail
} from '../utils'

const prompt = require('@system.prompt')

const resCallback = (res) => {
  return { errMsg: `${res}:ok` }
}

export function showToast (options) {
  const _default = {
    title: '',
    duration: 1500,
    bottom: '100px'
  }

  options = { ..._default, ...options }

  const { title, duration, bottom } = options

  if (!isString(title)) {
    return console.error(getParameterError({
      funcName: 'showToast',
      pName: 'title',
      pType: 'String',
      pWrongType: typeof title
    }))
  }

  if (!isNumber(duration)) {
    return console.error(getParameterError({
      funcName: 'showToast',
      pName: 'duration',
      pType: 'Number',
      pWrongType: typeof duration
    }))
  }

  if (!isString(bottom)) {
    return console.error(getParameterError({
      funcName: 'showToast',
      pName: 'bottom',
      pType: 'String',
      pWrongType: typeof bottom
    }))
  }

  const toastOptions = {
    message: title,
    duration,
    bottom
  }

  return new Promise(resolve => {
    prompt.showToast(toastOptions)
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

export function showActionSheet (options) {
  const _default = {
    title: '',
    itemList: [],
    itemColor: '#000000'
  }

  options = { ..._default, ...options }

  const { title, itemList, itemColor } = options

  if (!isString(title)) {
    return console.error(getParameterError({
      funcName: 'showActionSheet',
      pName: 'title',
      pType: 'String',
      pWrongType: typeof title
    }))
  }

  if (!isArray(itemList)) {
    return console.error(getParameterError({
      funcName: 'showActionSheet',
      pName: 'itemList',
      pType: 'Array',
      pWrongType: typeof itemList
    }))
  }

  const buttons = itemList.map(res => {
    return {
      text: res,
      color: itemColor
    }
  })

  return new Promise((resolve, reject) => {
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
