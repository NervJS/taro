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

import { createCallbackManager } from '../utils/index'

const callbackManager = createCallbackManager()

const resizeListener = () => {
  callbackManager.trigger({
    windowWidth: window.screen.width,
    windowHeight: window.screen.height
  })
}

/**
 * @typedef {Object} WindowResizeParam
 * @property {number} windowWidth 变化后的窗口宽度，单位 px
 * @property {number} windowHeight 变化后的窗口高度，单位 px
 */

/**
 * 监听窗口尺寸变化事件
 * @param {(size: WindowResizeParam) => void} callback 窗口尺寸变化事件的回调函数
 */
export const onWindowResize = callback => {
  callbackManager.add(callback)
  if (callbackManager.count() === 1) {
    window.addEventListener('resize', resizeListener)
  }
}

/**
 * 取消监听窗口尺寸变化事件
 * @param {(size: WindowResizeParam) => void} callback 窗口尺寸变化事件的回调函数
 */
export const offWindowResize = callback => {
  callbackManager.remove(callback)
  if (callbackManager.count() === 0) {
    window.removeEventListener('resize', resizeListener)
  }
}
