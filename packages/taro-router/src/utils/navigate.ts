/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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
 */

import MobileDetect from 'mobile-detect'

let md: MobileDetect
let preTitle = document.title
let isLoadDdEntry = false

export function getMobileDetect (): MobileDetect {
  if (!md) {
    md = new MobileDetect(navigator.userAgent)
  }
  return md
}

export async function setTitle (title: string): Promise<string> {
  if (preTitle === title) return title
  document.title = title
  preTitle = title
  if (process.env.SUPPORT_DINGTALK_NAVIGATE !== 'disabled' && isDingTalk()) {
    if (!isLoadDdEntry) {
      isLoadDdEntry = true
      require('dingtalk-jsapi/platform')
    }
    const setDingTitle = require('dingtalk-jsapi/api/biz/navigation/setTitle').default
    setDingTitle({ title })
  }
  return title
}

export function isWeixin (): boolean {
  const md = getMobileDetect()
  return md.match(/MicroMessenger/ig)
}

export function isDingTalk (): boolean {
  const md = getMobileDetect()
  return md.match(/DingTalk/ig)
}
