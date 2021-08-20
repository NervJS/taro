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

export default class Chain {
  constructor (requestParams, interceptors = [], index = 0) {
    this.index = index
    this.requestParams = requestParams
    this.interceptors = interceptors
  }

  proceed (requestParams) {
    this.requestParams = requestParams
    if (this.index >= this.interceptors.length) {
      throw new Error('chain 参数错误, 请勿直接修改 request.chain')
    }
    const nextInterceptor = this._getNextInterceptor()
    const nextChain = this._getNextChain()
    const p = nextInterceptor(nextChain)
    const res = p.catch(err => Promise.reject(err))
    if (typeof p.abort === 'function') res.abort = p.abort
    return res
  }

  _getNextInterceptor () {
    return this.interceptors[this.index]
  }

  _getNextChain () {
    return new Chain(this.requestParams, this.interceptors, this.index + 1)
  }
}
