import React from 'react'
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native'
import Toast from 'react-native-root-toast'
import RootSiblings from 'react-native-root-siblings'
import success from './success.png'

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
  container: {
    zIndex: 10000,
    position: 'absolute',
    width: '100%',
    height: '100%',
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
  }
})

class WXLoading extends React.Component {
  constructor () {
    super()
    this.state = {
      animating: true
    }
  }

  render () {
    const {title = 'loading'} = this.props
    return (
      <View style={styles.container}>
        <View style={styles.grayBlock}>
          <ActivityIndicator
            animating={this.state.animating}
            style={{flex: 1}}
            size='small'
            color='#eee'
          />
          <Text style={{
            paddingTop: 10,
            position: 'absolute',
            bottom: '15%',
            color: 'white',
            fontSize: 15
          }}>{title}</Text>
        </View>
      </View>
    )
  }
}

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
  const ToastView = !image && icon === 'loading' ? <WXLoading />
    : <View style={styles.container}>
      <View style={styles.grayBlock}>
        <View style={styles.toastView}>
          <Image source={source} style={styles.toastIcon} />
          <Text style={styles.toastContent}>{title || ''}</Text>
        </View>
      </View>
    </View>

  try {
    // setTimeout fires incorrectly when using chrome debug #4470
    // https://github.com/facebook/react-native/issues/4470
    let sibling = new RootSiblings(ToastView)
    setTimeout(() => {
      sibling.update(ToastView)
      success && success()
    }, 100)
    if (duration > 0) {
      setTimeout(() => {
        console.log('destroy')
        sibling.destroy()
      }, duration)
    }
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
