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

export function Behavior (options) {
  return options
}

export function getPreload (current) {
  return function (key, val) {
    if (typeof key === 'object') {
      current.preloadData = key
    } else if (key !== undefined && val !== undefined) {
      current.preloadData = {
        [key]: val
      }
    }
  }
}

export function getInitPxTransform (taro) {
  return function (config) {
    const {
      designWidth = 750,
      deviceRatio = {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2
      }
    } = config
    taro.config = taro.config || {}
    taro.config.designWidth = designWidth
    taro.config.deviceRatio = deviceRatio
  }
}

export function getPxTransform (taro) {
  return function (size) {
    const {
      designWidth = 750,
      deviceRatio = {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2
      }
    } = taro.config || {}
    if (!(designWidth in deviceRatio)) {
      throw new Error(`deviceRatio 配置中不存在 ${designWidth} 的设置！`)
    }
    return (parseInt(size, 10) * deviceRatio[designWidth]) + 'rpx'
  }
}
