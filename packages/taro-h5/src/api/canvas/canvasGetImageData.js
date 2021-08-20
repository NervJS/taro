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

import { findDOM } from '../utils/index'

/**
 * @typedef {Object} Param
 * @property {String} canvasId 画布标识，传入 <canvas> 组件的 canvas-id 属性。
 * @property {Number} x 将要被提取的图像数据矩形区域的左上角横坐标
 * @property {Number} y 将要被提取的图像数据矩形区域的左上角纵坐标
 * @property {Number} width 将要被提取的图像数据矩形区域的宽度
 * @property {Number} height 将要被提取的图像数据矩形区域的高度
 * @property {Function} [success] 接口调用成功的回调函数
 * @property {Function} [fail] 接口调用失败的回调函数
 * @property {Function} [complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */

/**
 * 获取 canvas 区域隐含的像素数据。
 * @param {Param} object 参数
 */
const canvasGetImageData = ({ canvasId, success, fail, complete, x, y, width, height }, inst) => {
  /** @type {HTMLCanvasElement} */
  const canvas = findDOM(inst).querySelector(`canvas[canvas-id="${canvasId}"]`)

  try {
    const ctx = canvas.getContext('2d')
    const data = ctx.getImageData(x, y, width, height)
    const res = {
      width,
      height,
      data
    }
    success && success(res)
    complete && complete()
    return Promise.resolve(res)
  } catch (e) {
    const res = {
      errMsg: e.message
    }
    fail && fail(res)
    complete && complete()
    return Promise.reject(res)
  }
}

export default canvasGetImageData
