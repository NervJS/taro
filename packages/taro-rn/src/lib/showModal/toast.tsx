import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native'
import RootSiblings from 'react-native-root-siblings'
import successPng from './success.png'
import { errorHandler, shouleBeObject, successHandler } from '../../utils'

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
  },
  textToastContent: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    lineHeight: 20,
    color: '#FFFFFF',
    textAlign: 'center'
  },
  container: {
    zIndex: 10000,
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noMaskContainer: {
    zIndex: 10000,
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 180,
    height: 180,
    marginLeft: -90,
    marginTop: -90,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemView: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.5)'
  },
  grayBlock: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20,20,20,0.8)',
    borderRadius: 8,
    flexDirection: 'column'
  },
  textGrayBlock: {
    width: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20,20,20,0.8)',
    borderRadius: 8,
    flexDirection: 'column'
  }
})

const WXLoading = ({
  title,
  mask
}) => {
  return (
    <View style={mask ? styles.container : styles.noMaskContainer}>
      <View style={styles.grayBlock}>
        <ActivityIndicator
          animating
          style={{ flex: 1 }}
          size='small'
          color='#eee'
        />
        <Text style={{
          paddingTop: 10,
          position: 'absolute',
          bottom: '15%',
          color: 'white',
          fontSize: 15
        }}
        >{title}</Text>
      </View>
    </View>
  )
}

WXLoading.propTypes = {
  title: PropTypes.string,
  mask: PropTypes.bool
}

function showToast (options: Taro.showToast.Option): Promise<Taro.General.CallbackResult> {
  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `showToast${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  let {title = '', icon = 'success', image, duration = 1500, mask = false, success, fail, complete} = options || {} // eslint-disable-line

  const isLoading = (icon === 'loading')

  const res = isLoading ? { errMsg: 'showLoading:ok' } : { errMsg: 'showToast:ok' }

  const maskStyle = mask ? styles.container : styles.noMaskContainer

  let ToastView

  if (image) {
    ToastView = <View style={maskStyle}>
      <View style={styles.grayBlock}>
        <View style={styles.toastView}>
          <Image source={image as any} style={styles.toastIcon} />
          <Text style={styles.toastContent}>{title || ''}</Text>
        </View>
      </View>
    </View>
  } else if (isLoading) {
    ToastView = <WXLoading title={title} mask={mask}/>
  } else if (icon === 'none') {
    ToastView = <View style={maskStyle}>
      <View style={styles.textGrayBlock}>
        <Text style={styles.textToastContent}>{title || ''}</Text>
      </View>
    </View>
  } else {
    ToastView = <View style={maskStyle}>
      <View style={styles.grayBlock}>
        <View style={styles.toastView}>
          <Image source={successPng} style={styles.toastIcon} />
          <Text style={styles.toastContent}>{title || ''}</Text>
        </View>
      </View>
    </View>
  }

  try {
    // setTimeout fires incorrectly when using chrome debug #4470
    // https://github.com/facebook/react-native/issues/4470
    (global as any).wxToastRootSiblings && (global as any).wxToastRootSiblings.destroy();

    (global as any).wxToastRootSiblings = new RootSiblings(ToastView)
    setTimeout(() => {
      (global as any).wxToastRootSiblings && (global as any).wxToastRootSiblings.update(ToastView)
    }, 100)
    if (duration > 0) {
      setTimeout(() => {
        (global as any).wxToastRootSiblings && (global as any).wxToastRootSiblings.destroy()
      }, duration)
    }
    return successHandler(success, complete)(res)
  } catch (e) {
    res.errMsg = isLoading ? `showLoading:fail invalid ${e}` : `showToast:fail invalid ${e}`
    return errorHandler(fail, complete)(res)
  }
}

function showLoading (options: Taro.showLoading.Option): Promise<Taro.General.CallbackResult> {
  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `showLoading${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { title = '', mask, success, fail, complete } = options || {}

  return showToast({
    title,
    icon: 'loading',
    duration: 0,
    mask,
    success,
    fail,
    complete
  })
}

function hideToast (opts: Taro.hideToast.Option = {}): void {
  const { success, fail, complete } = opts

  try {
    (global as any).wxToastRootSiblings && (global as any).wxToastRootSiblings.destroy();
    (global as any).wxToastRootSiblings = undefined
    const res = { errMsg: 'showToast:ok' }
    success && success(res)
    complete && complete(res)
  } catch (e) {
    const res = { errMsg: e }
    fail && fail(res)
    complete && complete(res)
  }
}

function hideLoading (opts: Taro.hideLoading.Option = {}): void {
  const { success, fail, complete } = opts

  try {
    (global as any).wxToastRootSiblings && (global as any).wxToastRootSiblings.destroy();
    (global as any).wxToastRootSiblings = undefined
    const res = { errMsg: 'showLoading:ok' }
    success && success(res)
    complete && complete(res)
  } catch (e) {
    const res = { errMsg: e }
    fail && fail(res)
    complete && complete(res)
  }
}

export {
  showToast,
  showLoading,
  hideToast,
  hideLoading
}
