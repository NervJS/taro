/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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
