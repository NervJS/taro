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

import Taro from '@tarojs/api'
import { history } from '@tarojs/router'
import { isFunction } from '@tarojs/shared'

import { getApp, getCurrentInstance, getCurrentPages, navigateBack, navigateTo, nextTick, redirectTo, reLaunch, switchTab } from '../api'
import { permanentlyNotSupport } from '../utils'

const {
  Behavior,
  getEnv,
  ENV_TYPE,
  Link,
  interceptors,
  getInitPxTransform,
  Current,
  options,
  eventCenter,
  Events,
  preload
} = Taro as any

const taro: typeof Taro = {
  // @ts-ignore
  Behavior,
  getEnv,
  ENV_TYPE,
  Link,
  interceptors,
  Current,
  getCurrentInstance,
  options,
  nextTick,
  eventCenter,
  Events,
  preload,
  history,
  navigateBack,
  navigateTo,
  reLaunch,
  redirectTo,
  getCurrentPages,
  switchTab
}

const initPxTransform = getInitPxTransform(taro)

const requirePlugin = permanentlyNotSupport('requirePlugin')

const pxTransform = function (size) {
  const config = (taro as any).config
  const baseFontSize = config.baseFontSize || 20
  const designWidth = (((input = 0) => isFunction(config.designWidth)
    ? config.designWidth(input)
    : config.designWidth))(size)
  const rootValue = baseFontSize / config.deviceRatio[designWidth] * 2
  return Math.ceil((parseInt(size, 10) / rootValue) * 10000) / 10000 + 'rem'
}

const canIUseWebp = function () {
  const canvas = document.createElement('canvas')
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

taro.requirePlugin = requirePlugin
taro.getApp = getApp
taro.pxTransform = pxTransform
taro.initPxTransform = initPxTransform
// @ts-ignore
taro.canIUseWebp = canIUseWebp

export default taro

export {
  Behavior,
  canIUseWebp,
  Current,
  ENV_TYPE,
  eventCenter,
  Events,
  getEnv,
  history,
  initPxTransform,
  interceptors,
  Link,
  options,
  preload,
  pxTransform,
  requirePlugin
}
