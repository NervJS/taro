import { document, window } from '@tarojs/runtime'

import { Cookie, createCookieInstance } from './Cookie'
import { XMLHttpRequest } from './XMLHttpRequest'

if (process.env.TARO_ENV !== 'h5') {
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

  window.XMLHttpRequest = XMLHttpRequest
}
export { Cookie, document, XMLHttpRequest }
