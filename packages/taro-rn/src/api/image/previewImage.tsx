import React from 'react'
import { Modal } from 'react-native'
import RootSiblings from 'react-native-root-siblings'
const ImageViewer = require('react-native-image-zoom-viewer')

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
          loadingRender={() => 'loading...'}
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
