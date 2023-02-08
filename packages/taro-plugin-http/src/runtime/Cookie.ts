/******************************************************************************
Copyright (c) 2019 wechat-miniprogram. 
Reference and modify code  by miniprogram-render/src/bom/cookie.js.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
import { parseUrl } from '@tarojs/runtime'
import { getStorageSync, setStorage } from '@tarojs/taro'

const STORAGE_KEY = 'PAGE_COOKIE'
export class Cookie {
  #map: any
  constructor () {
    this.#map = {} // 三维数组，domain - path - key
  }

  static parse (cookieStr: string) {
    if (!cookieStr && typeof cookieStr !== 'string') return null

    const cookieStrArr = cookieStr.trim().split(';')

    // key-value
    // eslint-disable-next-line no-control-regex
    const parseKeyValue = /^([^=;\x00-\x1F]+)=([^;\n\r\0\x00-\x1F]*).*/.exec(cookieStrArr.shift()!)
    if (!parseKeyValue) return null

    const key = (parseKeyValue[1] || '').trim()
    const value = (parseKeyValue[2] || '').trim()

    // 其他字段
    let path: string | null = null
    let domain: string | null = null
    let expires: number | null = null
    let maxAge: number | null = null
    let secure = false
    let httpOnly = false

    for (let item of cookieStrArr) {
      item = item.trim()
      if (!item) continue

      let [key, value] = item.split('=')
      key = (key || '').trim().toLowerCase()
      value = (value || '').trim()

      if (!key) continue

      switch (key) {
        case 'path':
          if (value[0] === '/') path = value
          break
        case 'domain':
          value = value.replace(/^\./, '').toLowerCase()
          if (value) domain = value
          break
        case 'expires':
          if (value) {
            const timeStamp = Date.parse(value)
            if (timeStamp) expires = timeStamp
          }
          break
        case 'max-age':
          if (/^-?[0-9]+$/.test(value)) maxAge = +value * 1000
          break
        case 'secure':
          secure = true
          break
        case 'httponly':
          httpOnly = true
          break
        default:
          // ignore
          break
      }
    }

    return {
      key,
      value,
      path,
      domain,
      expires,
      maxAge,
      secure,
      httpOnly,
    }
  }

  /**
   * 判断 domain
   */
  $_checkDomain (host, cookieDomain) {
    if (host === cookieDomain) return true

    const index = host.indexOf(`.${cookieDomain}`)

    return index > 0 && cookieDomain.length + index + 1 === host.length
  }

  /**
   * 判断 path
   */
  $_checkPath (path, cookiePath) {
    if (path === cookiePath) return true

    cookiePath = cookiePath === '/' ? '' : cookiePath
    return path.indexOf(`${cookiePath}/`) === 0
  }

  /**
   * 判断过期
   */
  $_checkExpires (cookie) {
    const now = Date.now()

    // maxAge 优先
    if (cookie.maxAge !== null) return cookie.createTime + cookie.maxAge > now

    // 判断 expires
    if (cookie.expires !== null) return cookie.expires > now

    return true
  }

  /**
   * 设置 cookie
   */
  setCookie (cookie, url) {
    cookie = Cookie.parse(cookie)

    if (!cookie) return

    const { hostname, port, pathname } = parseUrl(url)
    const host = (hostname || '') + (port ? ':' + port : '') || ''
    const path = (pathname || '')[0] === '/' ? pathname : '/'

    if (cookie.domain) {
      // 判断 domain
      if (!this.$_checkDomain(host, cookie.domain)) return
    } else {
      // 使用 host 作为默认的 domain
      cookie.domain = host
    }

    // 需要设置 path 字段的情况，取 url 中除去最后一节的 path
    if (!cookie.path || cookie.path[0] !== '/') {
      const lastIndex = path.lastIndexOf('/')

      cookie.path = lastIndex === 0 ? path : path.substr(0, lastIndex)
    }

    // 存入 cookie
    const map = this.#map
    const cookieDomain = cookie.domain
    const cookiePath = cookie.path
    const cookieKey = cookie.key

    if (!map[cookieDomain]) map[cookieDomain] = {}
    if (!map[cookieDomain][cookiePath]) map[cookieDomain][cookiePath] = {}

    const oldCookie = map[cookieDomain][cookiePath][cookieKey]
    cookie.createTime = (oldCookie && oldCookie.createTime) || Date.now()

    if (this.$_checkExpires(cookie)) {
      // 未过期
      map[cookieDomain][cookiePath][cookieKey] = cookie
    } else if (oldCookie) {
      // 存在旧 cookie，且被设置为已过期
      delete map[cookieDomain][cookiePath][cookieKey]
    }

    // 持久化 cookie
    setStorage &&
      setStorage({
        key: STORAGE_KEY,
        data: this.serialize(),
      })
  }

  /**
   * 拉取 cookie
   */
  getCookie (url: string, includeHttpOnly = false) {
    const { protocol, hostname, port, pathname } = parseUrl(url)
    const host = (hostname || '') + (port ? ':' + port : '') || ''
    const path = (pathname || '')[0] === '/' ? pathname : '/'
    const res: any[] = []

    const map = this.#map
    const domainList = Object.keys(map)

    for (const domainItem of domainList) {
      // 判断 domain
      if (this.$_checkDomain(host, domainItem)) {
        const domainMap = map[domainItem] || {}
        const pathList = Object.keys(domainMap)

        for (const pathItem of pathList) {
          // 判断 path
          if (this.$_checkPath(path, pathItem)) {
            const pathMap = map[domainItem][pathItem] || {}

            Object.keys(pathMap).forEach((key) => {
              const cookie: any = pathMap[key]

              if (!cookie) return

              // 判断协议
              if (cookie.secure && protocol !== 'https:' && protocol !== 'wss:') return
              if (!includeHttpOnly && cookie.httpOnly && protocol && protocol !== 'http:') return

              // 判断过期
              if (this.$_checkExpires(cookie)) {
                res.push(cookie)
              } else {
                // 过期，删掉
                delete map[domainItem][pathItem][key]
              }
            })
          }
        }
      }
    }

    return res
      .sort((a, b) => {
        const gap = a.createTime - b.createTime

        if (!gap) {
          return a.key < b.key ? -1 : 1
        } else {
          return gap
        }
      })
      .map((cookie) => `${cookie.key}=${cookie.value}`)
      .join('; ')
  }

  /**
   * 序列化
   */
  serialize () {
    try {
      return JSON.stringify(this.#map)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('cannot serialize the cookie')
      return ''
    }
  }

  /**
   * 反序列化
   */
  deserialize (str) {
    let map = {}
    try {
      map = JSON.parse(str)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('cannot deserialize the cookie')
      map = {}
    }

    // 合并 cookie
    const domainList = Object.keys(map)

    for (const domainItem of domainList) {
      const domainMap = map[domainItem] || {}
      const pathList = Object.keys(domainMap)

      for (const pathItem of pathList) {
        const pathMap = map[domainItem][pathItem] || {}

        Object.keys(pathMap).forEach((key) => {
          const cookie = pathMap[key]

          if (!cookie) return

          // 已存在则不覆盖
          if (!this.#map[domainItem]) this.#map[domainItem] = {}
          if (!this.#map[domainItem][pathItem]) this.#map[domainItem][pathItem] = {}
          if (!this.#map[domainItem][pathItem][key]) this.#map[domainItem][pathItem][key] = cookie
        })
      }
    }
  }
}

/**
 * 创建 cookie 实例并反序列化
 * @returns
 */
export function createCookieInstance () {
  const cookieInstance = new Cookie()
  try {
    const cookie = getStorageSync(STORAGE_KEY)
    if (cookie) cookieInstance.deserialize(cookie)
  } catch (err) {
    // ignore
  }
  return cookieInstance
}
