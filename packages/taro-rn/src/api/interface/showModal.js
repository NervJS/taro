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
    fail && fail(e)
    complete && complete()
  }

  function onConfirm () {
    console.log('onConfirm')
    sibling && sibling.destroy()
    sibling = undefined
    success && success({confirm: true, cancel: false})
    complete && complete()
  }

  function onCancel () {
    sibling && sibling.destroy()
    sibling = undefined
    fail && fail({confirm: false, cancel: true})
    complete && complete()
  }
}

export { showModal }
