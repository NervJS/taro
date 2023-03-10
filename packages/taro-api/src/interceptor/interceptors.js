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

import { isFunction, isUndefined } from '../utils'

export function timeoutInterceptor (chain) {
  const requestParams = chain.requestParams
  let p
  const res = new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      timeout = null
      reject(new Error('网络链接超时,请稍后再试！'))
    }, (requestParams && requestParams.timeout) || 60000)

    p = chain.proceed(requestParams)
    p
      .then(res => {
        if (!timeout) return
        clearTimeout(timeout)
        resolve(res)
      })
      .catch(err => {
        timeout && clearTimeout(timeout)
        reject(err)
      })
  })
  if (!isUndefined(p) && isFunction(p.abort)) res.abort = p.abort

  return res
}

export function logInterceptor (chain) {
  const requestParams = chain.requestParams
  const { method, data, url } = requestParams

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(`http ${method || 'GET'} --> ${url} data: `, data)
  }

  const p = chain.proceed(requestParams)
  const res = p
    .then(res => {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log(`http <-- ${url} result:`, res)
      }
      return res
    })
  if (isFunction(p.abort)) res.abort = p.abort

  return res
}
