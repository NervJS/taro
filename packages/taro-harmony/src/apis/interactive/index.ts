import { isString, isNumber } from '@tarojs/shared'
import { getParameterError, unsupport } from '../utils'
const prompt = require('@system.prompt')

const noop = () => {}

export function showToast (options) {
  const _default = {
    title: '',
    icon: 'success',
    image: '',
    duration: 1500,
    mask: false,
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
  return new Promise(resolve => {
    prompt.showToast({
      message: title,
      duration,
      bottom
    })
    resolve(null)
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
    success: noop,
    fail: noop,
    complete: noop
  }
  options = { ..._default, ...options }

  const {
    title, content, success, fail,
    cancelText, confirmText, cancelColor, confirmColor
  } = options

  const buttons: any = []

  if (cancelText !== '') {
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

  const modalOptions = {
    title,
    message: content,
    buttons: buttons,
    success: (data) => {
      if (data.index === 1) {
        return success({ confirm: true, cancel: null })
      } else {
        return success({ confirm: null, cancel: true })
      }
    },
    cancel: function () {
      fail()
    }
  }

  return new Promise(resolve => {
    prompt.showDialog(modalOptions)
    resolve(null)
  })
}

export function showActionSheet (options) {
  const _default = {
    title: '',
    itemList: [],
    itemColor: '#000000',
    success: noop,
    fail: noop,
    complete: noop
  }
  options = { ..._default, ...options }

  const { itemList, itemColor, success, fail } = options

  if (!Array.isArray(itemList)) {
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

  const actionSheetOptions = {
    title: 'Title Info',
    buttons: buttons,
    success: function (data) {
      success(data)
    },
    fail: function (data) {
      fail(data)
    }
  }

  return new Promise(resolve => {
    prompt.showActionMenu(actionSheetOptions)
    resolve(null)
  })
}

export function hideToast () {
  return new Promise(resolve => {
    prompt.showToast({
      message: '关闭中',
      duration: 10,
      bottom: '9999px'
    })
    resolve(null)
  })
}

export function showLoading () {
  process.env.NODE_ENV !== 'production' && unsupport('showLoading')
}

export function hideLoading () {
  process.env.NODE_ENV !== 'production' && unsupport('hideLoading')
}
