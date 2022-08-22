import React from 'react'
import { Text } from 'react-native'
import RootSiblings from 'react-native-root-siblings'
import Dialog from './Dialog'

function showModal (obj: Taro.showModal.Option): Promise<Taro.showModal.SuccessCallbackResult> {
  const {
    title = '',
    content = '',
    showCancel = true,
    cancelText = '取消',
    cancelColor = '#000000',
    confirmText = '确定',
    confirmColor = '#3CC51F',
    success,
    fail,
    complete
  } = obj || {}

  let sibling

  return new Promise((resolve, reject) => {
    function onConfirm () {
      const res = { errMsg: 'showModal:ok', confirm: true, cancel: false }
      sibling && sibling.destroy()
      sibling = undefined
      success?.(res)
      complete?.(res)
      resolve(res)
    }

    function onCancel () {
      const res = { errMsg: 'showModal:cancel', confirm: false, cancel: true }
      sibling && sibling.destroy()
      sibling = undefined
      success?.(res)
      complete?.(res)
      resolve(res)
    }
    try {
      sibling = new RootSiblings(
        <Dialog
          visible
          autoDectect
          title={title}
          onClose={onCancel}
          buttons={[
            showCancel && {
              type: cancelColor,
              label: cancelText,
              onPress: onCancel
            },
            {
              type: confirmColor,
              label: confirmText,
              onPress: onConfirm
            }
          ].filter(Boolean) as any}
        ><Text>{content}</Text></Dialog>
      )
    } catch (e) {
      const res = { errMsg: `showModal fail:${e.message}` }
      fail?.(res)
      complete?.(res)
      reject(res)
    }
  })
}

export { showModal }
