/*!
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

import { navigator } from './navigator'
import { document } from './document'
import { isBrowser, win } from '../env'
import { raf, caf } from './raf'
import { getComputedStyle } from './getComputedStyle'
import { DATE, SET_TIMEOUT } from '../constants'

export const window = isBrowser ? win : {
  navigator,
  document
}

if (!isBrowser) {
  const globalProperties = [
    ...Object.getOwnPropertyNames(global || win),
    ...Object.getOwnPropertySymbols(global || win)
  ]

  globalProperties.forEach(property => {
    if (property === 'atob') return
    if (!Object.prototype.hasOwnProperty.call(window, property)) {
      window[property] = global[property]
    }
  })

  ;(document as any).defaultView = window
}

if (process.env.TARO_ENV && process.env.TARO_ENV !== 'h5') {
  (window as any).requestAnimationFrame = raf;
  (window as any).cancelAnimationFrame = caf;
  (window as any).getComputedStyle = getComputedStyle;
  (window as any).addEventListener = function () {};
  (window as any).removeEventListener = function () {}
  if (!(DATE in window)) {
    (window as any).Date = Date
  }
  if (!(SET_TIMEOUT in window)) {
    (window as any).setTimeout = setTimeout
  }
}
