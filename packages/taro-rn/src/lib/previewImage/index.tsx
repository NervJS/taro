import React from 'react'
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native'
import RootSiblings from 'react-native-root-siblings'
import ImageViewer from 'react-native-image-zoom-viewer'
import CameraRoll from '@react-native-community/cameraroll'

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

// todo: 保存图片
export function saveImage(uri: string):void {
  const promise = CameraRoll.save(uri, { type: 'photo' })

  promise
    .then(() => {
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
    })
    .catch(error => {
      Alert.alert(
        'Error',
        error,
        [
          {
            text: 'OK'
          }
        ],
        { cancelable: false }
      )
    })
}

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
          useNativeDriver={true}
          saveToLocalByLongPress={false}
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
