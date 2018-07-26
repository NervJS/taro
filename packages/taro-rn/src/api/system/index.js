import {
  Platform,
  Dimensions,
  StatusBar,
  PixelRatio,
  DeviceInfo
} from 'react-native'

export function getSystemInfo (opts = {}) {
  const { success, fail, complete } = opts
  try {
    const res = getSystemInfoSync()
    success && success(res)
    complete && complete(res)

    return Promise.resolve(res)
  } catch (err) {
    const res = { errMsg: err.message }
    fail && fail(res)
    complete && complete(res)

    return Promise.reject(err)
  }
}

export function getSystemInfoSync () {
  const res = {}

  const pixelRatio = PixelRatio.get()
  const fontScale = PixelRatio.getFontScale()
  const os = Platform.OS
  const version = Platform.Version
  const isAndroid = Platform.OS === 'android'
  const statusBarHeight = isAndroid ? StatusBar.currentHeight : DeviceInfo.isIPhoneX_deprecated ? 44 : 20
  const screenWidth = Dimensions.get('screen').width
  const screenHeight = Dimensions.get('screen').height
  const windowWidth = Dimensions.get('window').width
  const windowHeight = Dimensions.get('window').height

  res.brand = null
  res.model = null
  res.pixelRatio = pixelRatio
  res.screenWidth = screenWidth
  res.screenHeight = screenHeight
  res.windowWidth = windowWidth
  res.windowHeight = windowHeight
  res.statusBarHeight = statusBarHeight
  res.language = null
  res.version = null
  res.system = version
  res.platform = os
  res.fontSizeSetting = fontScale
  res.SDKVersion = null

  return res
}

export function canIUse () {

}

export default {
  getSystemInfo,
  getSystemInfoSync,
  canIUse
}
