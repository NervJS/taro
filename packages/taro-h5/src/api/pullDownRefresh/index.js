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

import Taro from '@tarojs/api'
/**
 * 开始下拉刷新。调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
 * @param {Object} object 参数
 */
const startPullDownRefresh = function (object = {}) {
  return new Promise((resolve, reject) => {
    const { success, fail, complete } = object
    const res = {}
    Taro.eventCenter.trigger('__taroStartPullDownRefresh', {
      successHandler: () => {
        success && success(res)
        complete && complete()
        resolve(res)
      },
      errorHandler: () => {
        fail && fail(res)
        complete && complete()
        reject(res)
      }
    })
  })
}

/**
 * 停止当前页面下拉刷新。
 * @param {Object} object 参数
 */
const stopPullDownRefresh = function (object = {}) {
  return new Promise((resolve, reject) => {
    const { success, fail, complete } = object
    const res = {}
    Taro.eventCenter.trigger('__taroStopPullDownRefresh', {
      successHandler: () => {
        success && success(res)
        complete && complete()
        resolve(res)
      },
      errorHandler: () => {
        fail && fail(res)
        complete && complete()
        reject(res)
      }
    })
  })
}

export {
  startPullDownRefresh,
  stopPullDownRefresh
}
