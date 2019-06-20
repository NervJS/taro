import {
  Platform,
  Dimensions,
  StatusBar,
  PixelRatio
} from 'react-native'

export function getSystemInfo (opts = {}) {
  const { success, fail, complete }:any = opts
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

const isIPhoneX = (function () {
  const X_WIDTH = 375
  const X_HEIGHT = 812
  const XS_MAX_WIDTH = 414
  const XS_MAX_HEIGHT = 896

  const getResolvedDimensions = () => {
    const { width, height } = Dimensions.get('window')
    if (width === 0 && height === 0) return Dimensions.get('window')
    return { width, height }
  }

  const { height: D_HEIGHT, width: D_WIDTH } = getResolvedDimensions()

  if (Platform.OS === 'web') return false

  return (
    (D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
    (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT) ||
    ((D_HEIGHT === XS_MAX_HEIGHT && D_WIDTH === XS_MAX_WIDTH) ||
      (D_HEIGHT === XS_MAX_WIDTH && D_WIDTH === XS_MAX_HEIGHT))
  )
})()

export function getSystemInfoSync () {
  const res:any = {}

  const pixelRatio = PixelRatio.get()
  const fontScale = PixelRatio.getFontScale()
  const os = Platform.OS
  const version = Platform.Version
  const isAndroid = Platform.OS === 'android'
  const statusBarHeight = isAndroid ? StatusBar.currentHeight : isIPhoneX ? 44 : 20
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
