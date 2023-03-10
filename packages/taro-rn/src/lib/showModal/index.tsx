/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

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
