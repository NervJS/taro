import React from 'react'
import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native'
import RootSiblings from 'react-native-root-siblings'
import ImageViewer from 'react-native-image-zoom-viewer'

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

function previewImage (obj) {
  let {
    current,
    urls,
    success,
    fail,
    complete
  }:any = obj || {}
  let index = urls.indexOf(current)
  let sibling

  try {
    sibling = new RootSiblings(
      <Modal visible transparent>
        <ImageViewer
          imageUrls={urls.map((item) => {
            return {
              url: item,
              props: ''
            }
          })}
          index={index === -1 ? 0 : index}
          onClick={onSuccess}
          onSwipeDown={onSuccess}
          enableSwipeDown
          loadingRender={() => {
            return (
              <View style={[styles.loadingWrapper]}>
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

  function onSwipeDown () {
    sibling && sibling.destroy()
    sibling = undefined
  }

  function onSuccess () {
    const rsp = {errMsg: 'previewImage:ok'}
    onSwipeDown()
    success && success(rsp)
    complete && complete(rsp)
  }

  function onFail (e) {
    onSwipeDown()
    fail && fail({errMsg: 'err', ...e})
    complete && complete('err', ...e)
  }
}

export { previewImage }
