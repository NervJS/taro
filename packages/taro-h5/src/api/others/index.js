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

import { fromByteArray, toByteArray } from 'base64-js'
import { shouleBeObject, getParameterError } from '../utils'

export function arrayBufferToBase64 (arrayBuffer) {
  return fromByteArray(arrayBuffer)
}

export function base64ToArrayBuffer (base64) {
  return toByteArray(base64)
}

export function makePhoneCall (options) {
  // options must be an Object
  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `makePhoneCall${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { phoneNumber, success, fail, complete } = options
  const res = { errMsg: 'makePhoneCall:ok' }

  if (typeof phoneNumber !== 'string') {
    res.errMsg = getParameterError({
      name: 'makePhoneCall',
      para: 'phoneNumber',
      correct: 'String',
      wrong: phoneNumber
    })
    console.error(res.errMsg)
    typeof fail === 'function' && fail(res)
    typeof complete === 'function' && complete(res)
    return Promise.reject(res)
  }

  window.location.href = `tel:${phoneNumber}`

  typeof success === 'function' && success(res)
  typeof complete === 'function' && complete(res)

  return Promise.resolve(res)
}
