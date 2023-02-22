/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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
 *  SOFTWARE.
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
