/*
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

import MobileDetect from 'mobile-detect'

function getSystemInfoSync () {
  const md = new MobileDetect(navigator.userAgent)

  const info = {
    brand: md.mobile(), // 手机品牌
    model: md.mobile(), // 手机型号
    system: md.os(), // 操作系统版本
    pixelRatio: window.devicePixelRatio, // 设备像素比
    screenWidth: window.screen.width, // 屏幕宽度
    screenHeight: window.screen.height, // 屏幕高度
    windowWidth: document.documentElement.clientWidth, // 可使用窗口宽度
    windowHeight: document.documentElement.clientHeight, // 可使用窗口高度
    version: '', // 微信版本号
    statusBarHeight: '', // 状态栏的高度
    platform: navigator.platform, // 客户端平台
    language: navigator.language, // 微信设置的语言
    fontSizeSetting: '', // 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px
    SDKVersion: '' // 客户端基础库版本
  }

  return info
}

function getSystemInfo (options = {}) {
  const { success, complete } = options
  return new Promise(resolve => {
    const info = getSystemInfoSync()
    typeof success === 'function' && success(info)
    typeof complete === 'function' && complete(info)
    resolve(info)
  })
}

export { getSystemInfoSync, getSystemInfo }
