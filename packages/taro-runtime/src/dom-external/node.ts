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

import { parser } from '../dom-external/inner-html/parser'
import { GetDoc } from '../interface'

export type IPosition = 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'

/**
 * An implementation of `Element.insertAdjacentHTML()`
 * to support Vue 3 with a version of or greater than `vue@3.1.2`
 */
export function insertAdjacentHTMLImpl (
  position: IPosition,
  html: string,
  getDoc: GetDoc
) {
  const parsedNodes = parser(html, getDoc())

  for (let i = 0; i < parsedNodes.length; i++) {
    const n = parsedNodes[i]

    switch (position) {
      case 'beforebegin':
        this.parentNode?.insertBefore(n, this)
        break
      case 'afterbegin':
        if (this.hasChildNodes()) {
          this.insertBefore(n, this.childNodes[0])
        } else {
          this.appendChild(n)
        }
        break
      case 'beforeend':
        this.appendChild(n)
        break
      case 'afterend':
        this.parentNode?.appendChild(n)
        break
    }
  }
}
