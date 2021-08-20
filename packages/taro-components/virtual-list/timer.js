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

import { now, requestAnimationFrame, cancelAnimationFrame } from '@tarojs/runtime'

export function cancelTimeout (timeoutID) {
  cancelAnimationFrame(timeoutID.id)
}

export function requestTimeout (callback, delay) {
  const start = now()

  const timeoutID = {
    id: requestAnimationFrame(tick)
  }

  function tick () {
    if (now() - start >= delay) {
      // eslint-disable-next-line no-useless-call
      callback.call(null)
    } else {
      timeoutID.id = requestAnimationFrame(tick)
    }
  }

  return timeoutID
}
