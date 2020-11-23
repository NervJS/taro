import React from 'react'
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native'
import RootSiblings from 'react-native-root-siblings'
import ImageViewer from 'react-native-image-zoom-viewer'
import { saveMedia } from '../media'
import { downloadFile } from '../file'

const styles = StyleSheet.create({
  mask: {
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
      <View style={styles.mask}>
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
      </View>
    )
  } catch (e) {
    onFail(e)
  }
}
