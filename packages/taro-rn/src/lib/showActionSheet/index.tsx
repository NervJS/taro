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
import RootSiblings from 'react-native-root-siblings'
import ActionSheet from './ActionSheet'

function showActionSheet (obj: Taro.showActionSheet.Option): Promise<Taro.showActionSheet.SuccessCallbackResult> {
  const {
    itemList = [],
    itemColor = '#000000',
    success,
    fail,
    complete
  } = obj || {}

  const autoDectect = true
  const type = 'ios'

  return new Promise((resolve, reject) => {
    let sibling: any
    function onSuccess (tapIndex) {
      sibling && sibling.destroy()
      sibling = undefined
      const res = { tapIndex, errMsg: 'showActionSheet:ok' }
      success?.(res)
      complete?.(res)
      resolve(res)
    }

    function onFail () {
      const res = { errMsg: 'showActionSheet:fail cancel' }
      sibling && sibling.destroy()
      sibling = undefined
      fail?.(res)
      complete?.(res)
      reject(res)
    }

    sibling = new RootSiblings(
      <ActionSheet
        autoDectect={autoDectect}
        type={type}
        visible={false}
        onClose={onFail}
        menus={
          itemList.map((item, index) => {
            return {
              type: 'default',
              label: item,
              textStyle: { color: itemColor },
              onPress: onSuccess.bind(this, index)
            }
          }) as any
        }
        actions={[
          {
            type: 'default',
            label: '取消',
            textStyle: { color: itemColor },
            onPress: onFail.bind(this)
          }
        ] as any}
      />
    )

    // hack 的做法。不推荐
    setTimeout(() => {
      sibling.update(
        <ActionSheet
          autoDectect={autoDectect}
          type={type}
          visible
          onClose={onFail}
          menus={
            itemList.map((item, index) => {
              return {
                type: 'default',
                label: item,
                textStyle: { color: itemColor },
                onPress: onSuccess.bind(this, index)
              }
            }) as any
          }
          actions={[
            {
              type: 'default',
              label: '取消',
              textStyle: { color: itemColor },
              onPress: onFail.bind(this)
            }
          ] as any}
        />
      )
    }, 100)
  })
}

export { showActionSheet }
