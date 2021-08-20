/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
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
      success && success(res)
      complete && complete(res)
      resolve(res)
    }

    function onCancel () {
      const res = { errMsg: 'showModal:cancel', confirm: false, cancel: true }
      sibling && sibling.destroy()
      sibling = undefined
      success && success(res)
      complete && complete(res)
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
      fail && fail(res)
      complete && complete(res)
      reject(res)
    }
  })
}

export { showModal }
