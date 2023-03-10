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
 *  SOFTWARE.
 */

import { isFunction } from '../utils'

export default class Chain {
  constructor (requestParams, interceptors, index) {
    this.index = index || 0
    this.requestParams = requestParams
    this.interceptors = interceptors || []
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
    Object.keys(p).forEach(k => isFunction(p[k]) && (res[k] = p[k]))
    return res
  }

  _getNextInterceptor () {
    return this.interceptors[this.index]
  }

  _getNextChain () {
    return new Chain(this.requestParams, this.interceptors, this.index + 1)
  }
}
