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

import { Current } from './current'
import { getPath } from './dsl/common'
import { TaroRootElement } from './dom/root'
import { document } from './bom/document'
import { isBrowser } from './env'

import type { Func } from './interface'

function removeLeadingSlash (path?: string) {
  if (path == null) {
    return ''
  }
  return path.charAt(0) === '/' ? path.slice(1) : path
}

export const nextTick = (cb: Func, ctx?: Record<string, any>) => {
  const router = Current.router
  const timerFunc = () => {
    setTimeout(function () {
      ctx ? cb.call(ctx) : cb()
    }, 1)
  }

  if (router !== null) {
    let pageElement: TaroRootElement | null = null
    const path = getPath(removeLeadingSlash(router.path), router.params)
    pageElement = document.getElementById<TaroRootElement>(path)
    if (pageElement !== null) {
      if (isBrowser) {
        // eslint-disable-next-line dot-notation
        pageElement.firstChild?.['componentOnReady']?.().then(() => {
          timerFunc()
        }) ?? timerFunc()
      } else {
        pageElement.enqueueUpdateCallback(cb, ctx)
      }
    } else {
      timerFunc()
    }
  } else {
    timerFunc()
  }
}
