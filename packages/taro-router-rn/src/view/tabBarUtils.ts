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

import { Dimensions, Platform, StatusBar } from 'react-native'

export function getInitSafeAreaInsets (): Record<string, number> {
  const safeInsets = {
    top: getStatusBarHeight(true),
    bottom: getBottomSpace(),
    right: 0,
    left: 0
  }
  return safeInsets
}

function getStatusBarHeight (safe) {
  return Platform.select({
    ios: ifIphoneX(safe ? 44 : 30, 20),
    android: StatusBar.currentHeight,
    default: 0
  })
}

function getBottomSpace () {
  return isIphoneX() ? 34 : 0
}

function isIphoneX () {
  const dimen = Dimensions.get('window')
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    ((dimen.height === 780 || dimen.width === 780) ||
      (dimen.height === 812 || dimen.width === 812) ||
      (dimen.height === 844 || dimen.width === 844) ||
      (dimen.height === 896 || dimen.width === 896) ||
      (dimen.height === 926 || dimen.width === 926))
  )
}

function ifIphoneX (iphoneXStyle, regularStyle) {
  if (isIphoneX()) {
    return iphoneXStyle
  }
  return regularStyle
}
