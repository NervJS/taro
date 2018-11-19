import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import Toast from 'react-native-root-toast'
import success from './success.png'
import LoadingView from './LoadingView'

const styles = StyleSheet.create({
  toastView: {
    width: 76,
    height: 76,
    justifyContent: 'center',
    alignItems: 'center'
  },
  toastIcon: {
    width: 55,
    height: 55
  },
  toastContent: {
    color: '#FFFFFF',
    textAlign: 'center'
  }
})

const iconList = ['success', 'loading', 'none']
const sourceMap = {success, none: ''}
let wx

function showToast (obj) {
  let {title = '', icon = 'success', image, duration = 1500, mask, success, fail, complete} = obj || {} // eslint-disable-line
  let source
  if (image) {
    source = image
  } else if (iconList.indexOf(icon) > -1) {
    source = sourceMap[icon]
  }
  const ToastView = (
    <View style={styles.toastView}>
      {
        !image && icon === 'loading' ? <LoadingView /> : <Image source={source} style={styles.toastIcon} />
      }
      <Text style={styles.toastContent}>{title || ''}</Text>
    </View>
  )

  try {
    global.wxToastRootSiblings = Toast.show(ToastView, { // eslint-disable-line
      duration: duration,
      position: Toast.positions.CENTER,
      opacity: 1,
      shadow: false,
      backgroundColor: 'rgba(0,0,0,0.7)',
      onShow: () => {
        success && success()
        complete && complete()
      }
    })
  } catch (e) {
    fail && fail()
    complete && complete()
  }
}

function showLoading (obj) {
  let {title = '', mask, success, fail, complete} = obj || {}
  showToast({
    title,
    icon: 'loading',
    duration: 0,
    mask,
    success,
    fail,
    complete
  })
}

function hideToast () {
  global.wxToastRootSiblings && Toast.hide(global.wxToastRootSiblings)
  global.wxToastRootSiblings = undefined
}

wx = {
  showToast,
  showLoading,
  hideToast,
  hideLoading: hideToast
}

export default wx
