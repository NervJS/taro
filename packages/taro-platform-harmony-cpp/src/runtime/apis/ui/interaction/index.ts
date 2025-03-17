import { Current } from '@tarojs/runtime'

import { callAsyncFail, callAsyncSuccess } from '../../utils'

export * from '@tarojs/plugin-platform-harmony-ets/dist/apis/ui/interaction'

const resCallback = (res) => {
  return { errMsg: `${res}:ok` }
}

// 覆盖showModal
export function showModal (options) {
  const _default = {
    title: '',
    content: '',
    showCancel: true,
    cancelText: '取消',
    cancelColor: '#000000',
    confirmText: '确定',
    confirmColor: '#3CC51F',
    backgroundColor: '#ffffff'
  }

  options = { ..._default, ...options }

  const {
    title, content, cancelText, confirmText,
    cancelColor, confirmColor, showCancel, backgroundColor
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
      backgroundColor
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
