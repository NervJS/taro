const prompt = require('@system.prompt')

const noop = function () {}

export function showToast (options) {
  const _default = {
    title: '',
    icon: 'success',
    image: '',
    duration: 1500,
    mask: false
  }
  options = { ..._default, ...options }

  if (typeof options.title !== 'string') {
    return
  }

  if (typeof options.duration !== 'number') {
    return
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

export function hideToast () {
  return prompt.showToast({
    message: '',
    duration: 100
  })
}
