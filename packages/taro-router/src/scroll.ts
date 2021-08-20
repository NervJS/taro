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

import type { PageInstance } from '@tarojs/runtime'
import { PageConfig } from '@tarojs/taro'

let pageScrollFn
let pageDOM: Element | Window = window

export function bindPageScroll (page: PageInstance, config: Partial<PageConfig>) {
  pageDOM.removeEventListener('scroll', pageScrollFn)
  pageDOM = getScrollContainer()

  const distance = config.onReachBottomDistance || 50
  let isReachBottom = false

  pageScrollFn = function () {
    page.onPageScroll && page.onPageScroll({
      scrollTop: pageDOM instanceof Window ? window.scrollY : pageDOM.scrollTop
    })

    if (isReachBottom && getOffset() > distance) {
      isReachBottom = false
    }

    if (
      page.onReachBottom &&
      !isReachBottom &&
      getOffset() < distance
    ) {
      isReachBottom = true
      page.onReachBottom()
    }
  }

  pageDOM.addEventListener('scroll', pageScrollFn, false)
}

window.addEventListener('DOMSubtreeModified', (e) => {
  // @ts-ignore
  const className = e.target?.className
  if (className && /taro-tabbar__/.test(className)) {
    pageDOM.removeEventListener('scroll', pageScrollFn)
    pageDOM = getScrollContainer()
    pageDOM.addEventListener('scroll', pageScrollFn, false)
  }
}, false)

function getScrollContainer (): Element | Window {
  if (document.querySelector('.taro-tabbar__tabbar') === null) {
    // 没设置tabbar
    return window
  } else {
    // 有设置tabbar
    return document.querySelector('.taro-tabbar__panel') || window
  }
}

function getOffset () {
  if (pageDOM instanceof Window) {
    return document.documentElement.scrollHeight - window.scrollY - window.innerHeight
  } else {
    return pageDOM.scrollHeight - pageDOM.scrollTop - pageDOM.clientHeight
  }
}
