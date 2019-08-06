import React from 'react'
import { Text } from 'react-native'
import RootSiblings from 'react-native-root-siblings'
import Dialog from '../Dialog'

function showModal (obj) {
  let {
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
          ].filter(Boolean)}
        ><Text>{content}</Text></Dialog>
      )
    } catch (e) {
      const res = {errMsg: `showModal fail:${e.message}`}
      fail && fail(res)
      complete && complete(res)
      reject(res)
    }

    function onConfirm () {
      console.log('onConfirm')
      const res = {errMsg: 'showModal:ok', confirm: true, cancel: false}
      sibling && sibling.destroy()
      sibling = undefined
      success && success(res)
      complete && complete(res)
      resolve(res)
    }

    function onCancel () {
      const res = {errMsg: 'showModal:fail cancel', confirm: false, cancel: true}
      sibling && sibling.destroy()
      sibling = undefined
      fail && fail(res)
      complete && complete(res)
      resolve(res)
    }
  })
}

export { showModal }
