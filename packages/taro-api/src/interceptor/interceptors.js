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

export function timeoutInterceptor (chain) {
  const requestParams = chain.requestParams
  let p
  const res = new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      timeout = null
      reject(new Error('网络链接超时,请稍后再试！'))
    }, (requestParams && requestParams.timeout) || 60000)

    p = chain.proceed(requestParams)
    p.then(res => {
      if (!timeout) return
      clearTimeout(timeout)
      resolve(res)
    }).catch(err => {
      timeout && clearTimeout(timeout)
      reject(err)
    })
  })

  if (p !== undefined && typeof p.abort === 'function') res.abort = p.abort
  return res
}

export function logInterceptor (chain) {
  const requestParams = chain.requestParams
  const { method, data, url } = requestParams
  // eslint-disable-next-line no-console
  console.log(`http ${method || 'GET'} --> ${url} data: `, data)
  const p = chain.proceed(requestParams)
  const res = p.then(res => {
    // eslint-disable-next-line no-console
    console.log(`http <-- ${url} result:`, res)
    return res
  })
  if (typeof p.abort === 'function') res.abort = p.abort
  return res
}
