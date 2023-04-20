import { document, window } from '@tarojs/runtime'
import { isWebPlatform } from '@tarojs/shared'

import { Cookie, createCookieInstance } from './Cookie'
import { XMLHttpRequest } from './XMLHttpRequest'

declare const ENABLE_COOKIE: boolean

if (!isWebPlatform()) {
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
