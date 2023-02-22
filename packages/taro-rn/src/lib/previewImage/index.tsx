/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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
import { View, ActivityIndicator, StyleSheet, Alert, Modal } from 'react-native'
import RootSiblings from 'react-native-root-siblings'
import ImageViewer from 'react-native-image-zoom-viewer'
import { saveMedia } from '../media'
import { downloadFile } from '../file'

const styles = StyleSheet.create({
  mask: {
    elevation: 1,
    position: 'absolute',
    backgroundColor: '#000000',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
})

export function previewImage(obj: Taro.previewImage.Option): void {
  const {
    current,
    urls,
    success,
    fail,
    complete
  }: any = obj || {}
  const index = urls.indexOf(current)
  if (index === -1) {
    throw new Error('"current" or "urls" is invalid')
  }

  let sibling

  function onSwipeDown() {
    sibling?.destroy()
    sibling = undefined
  }

  function onSuccess() {
    const rsp = { errMsg: 'previewImage:ok' }
    onSwipeDown()
    success?.(rsp)
    complete?.(rsp)
  }

  function onFail(e) {
    onSwipeDown()
    fail?.({ errMsg: 'err', ...e })
    complete?.('err', ...e)
  }
  // 长按保存图片
  function saveImage(uri) {
    downloadFile({
      url: uri,
      success({ tempFilePath }) {
        const opts = {
          filePath: tempFilePath,
          success() {
            Alert.alert(
              'Success',
              '图片保存成功',
              [
                {
                  text: 'OK'
                }
              ],
              { cancelable: false }
            )
          },
          fail(err) {
            Alert.alert(
              'Error',
              err,
              [
                {
                  text: 'OK'
                }
              ],
              { cancelable: false }
            )
          }
        }
        saveMedia(opts, 'photo', 'saveToLocalByLongPress')
      }
    })
  }
  try {
    sibling = new RootSiblings(
      <Modal style={styles.mask} onRequestClose={onSwipeDown}>
        <ImageViewer
          imageUrls={urls.map((item: string) => {
            return {
              url: item,
              props: ''
            }
          })}
          index={index === -1 ? 0 : index}
          onCancel={onSuccess}
          onClick={onSuccess}
          onSwipeDown={onSuccess}
          onSave={saveImage}
          useNativeDriver={true}
          enableSwipeDown
          menuContext={{
            saveToLocal: '保存图片到相册',
            cancel: '取消'
          }}
          loadingRender={() => {
            return (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={'#999'} />
              </View>
            )
          }}
        />
      </Modal>
    )
  } catch (e) {
    onFail(e)
  }
}
