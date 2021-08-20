/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
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
