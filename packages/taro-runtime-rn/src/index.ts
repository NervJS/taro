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

export {
  createPageConfig,
  startPullDownRefresh,
  stopPullDownRefresh,
  pageScrollTo,
  setBackgroundColor,
  setBackgroundTextStyle,
  getCurrentPages
} from './page'
export {
  createReactNativeApp,
  getApp
} from './app'
export {
  Current,
  getCurrentInstance
} from './current'
export * from './hooks'
export * from './emmiter'
export {
  navigateTo,
  redirectTo,
  navigateBack,
  switchTab,
  reLaunch,
  showTabBar,
  hideTabBar,
  showTabBarRedDot,
  hideTabBarRedDot,
  setTabBarBadge,
  removeTabBarBadge,
  setTabBarItem,
  setNavigationBarTitle,
  setNavigationBarColor,
  showNavigationBarLoading,
  hideNavigationBarLoading,
  setTabBarStyle
} from '@tarojs/router-rn'
export {
  pxTransform
} from './compute'
