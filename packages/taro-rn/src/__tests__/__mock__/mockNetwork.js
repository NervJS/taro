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

// eslint-disable-next-line
const noop = () => {}

export default class NetInfo {
  constructor (connectionType = 'wifi', effectiveConnectionType = '4g') {
    this.connectionType = connectionType
    this.effectiveConnectionType = effectiveConnectionType
    this.eventMaps = {}
    this.connectedStatus = connectionType === 'wifi' || connectionType === 'cellular'
  }

  isConnected = {
    fetch: this.fetch.bind(this)
  }

  fetch () {
    return new Promise((resolve) => {
      resolve({
        type: this.connectionType,
      })
    })
  }

  getConnectionInfo () {
    return new Promise((resolve) => {
      const res = {}
      res.type = this.connectionType
      res.effectiveType = this.effectiveConnectionType
      resolve(res)
    })
  }

  addEventListener (eventName, listener = noop) {
    this.eventMaps[eventName] = listener
  }

  removeEventListener (eventName, listener = noop) {
    if (this.eventMaps[eventName] === listener) {
      delete this.eventMaps[eventName]
    }
  }

  // 纯粹为了模拟测试用，主动更改网络状态
  changeNetworkType (connectionType, effectiveConnectionType = '4g') {
    if (this.connectionType !== connectionType) {
      this.connectionType = connectionType
      if (connectionType === 'cellular') {
        this.effectiveConnectionType = effectiveConnectionType
      }
      this.connectedStatus = connectionType === 'wifi' || connectionType === 'cellular'

      const res = {}
      res.type = this.connectionType
      res.effectiveType = this.effectiveConnectionType
      const fn = this.eventMaps.connectionChange
      fn && fn(res)
    }
  }
}
