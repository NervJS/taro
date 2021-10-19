import { getParameterError } from '../utils'
const prompt = require('@system.prompt')

const noop = function () {}

export function showToast (options) {
  const _default = {
    title: '',
    icon: 'success',
    image: '',
    duration: 1500,
    mask: false,
    bottom: ''
  }
  options = { ..._default, ...options }

  if (typeof options.title !== 'string') {
    return console.error(getParameterError({
      name: 'showToast',
      correct: 'String',
      wrong: 'title'
    }))
  }

  if (typeof options.duration !== 'number') {
    return console.error(getParameterError({
      name: 'showToast',
      correct: 'Number',
      wrong: 'duration'
    }))
  }

  if (typeof options.bottom !== 'string') {
    return console.error(getParameterError({
      name: 'showToast',
      correct: 'String',
      wrong: 'bottom'
    }))
  }

  return prompt.showToast({
    message: options.title,
    duration: options.duration
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
    success: function (data) {
      success(data)
    },
    cancel: function () {
      fail()
    }
  }

  return prompt.showDialog(modalOptions)
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

  prompt.showActionMenu(actionSheetOptions)
}

export function hideToast () {
  return prompt.showToast({
    message: '',
    duration: 10
  })
}
