import { isString, isNumber, isArray } from '@tarojs/shared'
import {
  getParameterError, unsupport, noop, callAsyncSuccess
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
      name: 'showToast',
      correct: 'String',
      wrong: 'title'
    }))
  }

  if (!isNumber(duration)) {
    return console.error(getParameterError({
      name: 'showToast',
      correct: 'Number',
      wrong: 'duration'
    }))
  }

  if (!isString(bottom)) {
    return console.error(getParameterError({
      name: 'showToast',
      correct: 'String',
      wrong: 'bottom'
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
    confirmColor: '#3CC51F',
    cancel: noop,
    complete: noop
  }

  options = { ..._default, ...options }

  const {
    title, content, cancelText, confirmText, complete,
    cancelColor, confirmColor, showCancel, cancel
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
      cancel: (data) => {
        const cancelObject = { errMsg: `showModal: ${data}` }
        resolve(cancelObject)
        cancel(cancelObject)
        complete(cancelObject)
      }
    }

    prompt.showDialog(modalOptions)
  })
}

export function showActionSheet (options) {
  const _default = {
    title: '',
    itemList: [],
    itemColor: '#000000',
    fail: noop,
    complete: noop
  }

  options = { ..._default, ...options }

  const { title, itemList, itemColor, fail, complete } = options

  if (!isString(title)) {
    return console.error(getParameterError({
      name: 'showActionSheet',
      correct: 'String',
      wrong: 'title'
    }))
  }

  if (!isArray(itemList)) {
    return console.error(getParameterError({
      name: 'showActionSheet',
      correct: 'Array',
      wrong: 'itemList'
    }))
  }

  const buttons = itemList.map(res => {
    return {
      text: res,
      color: itemColor
    }
  })

  return new Promise((resolve) => {
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
        const failObject = {
          ...data,
          errMsg: data.errMsg.replace('showActionMenu', 'showActionSheet')
        }
        resolve(failObject)
        fail(failObject)
        complete(failObject)
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
