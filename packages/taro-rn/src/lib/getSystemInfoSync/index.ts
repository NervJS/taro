import {
  Platform,
  Dimensions,
  PixelRatio
} from 'react-native'
import { initialWindowMetrics } from 'react-native-safe-area-context'
import DeviceInfo from 'react-native-device-info'

export function getSystemInfoSync(): Taro.getSystemInfoSync.Result {
  const res: any = {}

  const brand = DeviceInfo.getBrand()
  const model = DeviceInfo.getModel()
  const pixelRatio = PixelRatio.get()
  const fontScale = PixelRatio.getFontScale()
  const os = Platform.OS
  const version = DeviceInfo.getVersion()
  const system = os + ' ' + Platform.Version
  const screenWidth = Dimensions.get('screen').width
  const screenHeight = Dimensions.get('screen').height
  const windowWidth = Dimensions.get('window').width
  const windowHeight = Dimensions.get('window').height
  const deviceOrientation = screenHeight > screenWidth ? 'portrait' : 'landscape'

  // NOTE：在竖屏正方向下的安全区域
  let safeArea = {}
  const { top = 0, bottom = 0 } = initialWindowMetrics?.insets || {}
  try {
    const W = Math.min(screenWidth, screenHeight)
    const H = Math.max(screenWidth, screenHeight)
    safeArea = {
      left: 0,
      right: W,
      top,
      bottom: H - bottom,
      height: H - bottom - top,
      width: W,
    }
  } catch (error) {
    console.log('calculate safeArea fail: ', error)
  }
  res.brand = brand
  res.model = model
  res.pixelRatio = pixelRatio
  res.safeArea = safeArea
  res.screenWidth = screenWidth
  res.screenHeight = screenHeight
  res.windowWidth = windowWidth
  res.windowHeight = windowHeight
  res.statusBarHeight = top
  res.language = null
  res.version = version
  res.system = system
  res.platform = os
  res.fontSizeSetting = fontScale
  res.SDKVersion = null
  res.deviceOrientation = deviceOrientation

  return res
}
