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

import { document, window } from '@tarojs/runtime'

import { Cookie, createCookieInstance } from './Cookie'
import { XMLHttpRequest } from './XMLHttpRequest'

declare const ENABLE_COOKIE: boolean

if (process.env.TARO_ENV !== 'h5') {

  if (ENABLE_COOKIE) {

    const _cookie = createCookieInstance()
  
    Object.defineProperties(document, {
      URL: {
        get () {
          if (this.defaultView) return this.defaultView.location.href
          return ''
        },
      },
      cookie: {
        get () {
          return _cookie.getCookie(this.URL)
        },
        set (value: string) {
          if (!value || typeof value !== 'string') return
          _cookie.setCookie(value, this.URL)
        },
      },
    })
  }

  window.XMLHttpRequest = XMLHttpRequest
}
export { Cookie, document, XMLHttpRequest }
