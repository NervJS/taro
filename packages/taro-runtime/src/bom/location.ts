import { isNumber, isString, warn } from '@tarojs/shared'

import { CONTEXT_ACTIONS } from '../constants'
import { getCurrentInstance } from '../current'
import { Events } from '../emitter/emitter'
import env from '../env'
import { RuntimeCache } from '../utils/cache'
import { TaroURLProvider } from './URL'

type PreValue = ReturnType<typeof TaroURLProvider.prototype._toRaw>

type Options = {
  window: any
}
type LocationContext = {
  lastHref: string
}

const INIT_URL = 'https://taro.com'
const cache = new RuntimeCache<LocationContext>('location')

class TaroLocation extends Events {
  /* private property */
  #url = new TaroURLProvider(INIT_URL)
  #noCheckUrl = false
  #window: any

  constructor (options: Options) {
    super()

    this.#window = options.window

    this.#reset()

    this.on(
      '__set_href_without_history__',
      (href: string) => {
        this.#noCheckUrl = true

        const lastHash = this.#url.hash
        this.#url.href = generateFullUrl(href)

        if (lastHash !== this.#url.hash) {
          this.#window.trigger('hashchange')
        }

        this.#noCheckUrl = false
      },
      null
    )

    // 切换上下文行为
    this.on(
      CONTEXT_ACTIONS.INIT,
      () => {
        this.#reset()
      },
      null
    )

    this.on(
      CONTEXT_ACTIONS.RESTORE,
      (pageId: string) => {
        cache.set(pageId, {
          lastHref: this.href,
        })
      },
      null
    )

    this.on(
      CONTEXT_ACTIONS.RECOVER,
      (pageId: string) => {
        // 数据恢复时，不需要执行跳转
        if (cache.has(pageId)) {
          const ctx = cache.get(pageId)!
          this.#noCheckUrl = true
          this.#url.href = ctx.lastHref
          this.#noCheckUrl = false
        }
      },
      null
    )

    this.on(
      CONTEXT_ACTIONS.DESTORY,
      (pageId: string) => {
        cache.delete(pageId)
      },
      null
    )
  }

  /* private method */
  #reset () {
    const Current = getCurrentInstance()
    const router = Current.router
    if (router) {
      const { path, params } = router
      const searchArr = Object.keys(params).map((key) => {
        return `${key}=${params[key]}`
      })
      const searchStr = searchArr.length > 0 ? '?' + searchArr.join('&') : ''
      const url = `${INIT_URL}${path.startsWith('/') ? path : '/' + path}${searchStr}`

      this.#url = new TaroURLProvider(url)

      this.trigger('__reset_history__', this.href)
    }
  }

  #getPreValue (): PreValue {
    return this.#url._toRaw()
  }

  #rollBack (href: string) {
    this.#url.href = href
  }

  #recordHistory () {
    this.trigger('__record_history__', this.href)
  }

  /**
   * 校验url的变化，是否需要更新history
   */
  #checkUrlChange (preValue: PreValue): boolean {
    if (this.#noCheckUrl) {
      return false
    }

    const { protocol, hostname, port, pathname, search, hash } = this.#url._toRaw()

    // 跨域三要素不允许修改
    if (protocol !== preValue.protocol || hostname !== preValue.hostname || port !== preValue.port) {
      this.#rollBack(preValue.href)
      return false
    }

    // pathname
    if (pathname !== preValue.pathname) {
      return true
    }

    // search
    if (search !== preValue.search) {
      return true
    }

    // hashchange
    if (hash !== preValue.hash) {
      this.#window.trigger('hashchange')
      return true
    }

    this.#rollBack(preValue.href)
    return false
  }

  /* public property */
  get protocol () {
    return this.#url.protocol
  }

  set protocol (val: string) {
    const REG = /^(http|https):$/i
    if (!val || !isString(val) || !REG.test(val.trim())) return

    val = val.trim()
    const preValue = this.#getPreValue()
    this.#url.protocol = val

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get host () {
    return this.#url.host
  }

  set host (val: string) {
    if (!val || !isString(val)) return
    val = val.trim()

    const preValue = this.#getPreValue()
    this.#url.host = val

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get hostname () {
    return this.#url.hostname
  }

  set hostname (val: string) {
    if (!val || !isString(val)) return
    val = val.trim()

    const preValue = this.#getPreValue()
    this.#url.hostname = val

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get port () {
    return this.#url.port
  }

  set port (val: string) {
    const xVal = Number((val = val.trim()))
    if (!isNumber(xVal) || xVal <= 0) return

    const preValue = this.#getPreValue()
    this.#url.port = val

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get pathname () {
    return this.#url.pathname
  }

  set pathname (val: string) {
    if (!val || !isString(val)) return
    val = val.trim()

    const preValue = this.#getPreValue()
    this.#url.pathname = val

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get search () {
    return this.#url.search
  }

  set search (val: string) {
    if (!val || !isString(val)) return
    val = val.trim()
    val = val.startsWith('?') ? val : `?${val}`

    const preValue = this.#getPreValue()
    this.#url.search = val

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get hash () {
    return this.#url.hash
  }

  // 小程序的navigateTo存在截断hash字符串的问题
  set hash (val: string) {
    if (!val || !isString(val)) return
    val = val.trim()
    val = val.startsWith('#') ? val : `#${val}`

    const preValue = this.#getPreValue()
    this.#url.hash = val

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get href () {
    return this.#url.href
  }

  set href (val: string) {
    const REG = /^(http:|https:)?\/\/.+/
    if (!val || !isString(val) || !REG.test((val = val.trim()))) return

    const preValue = this.#getPreValue()
    this.#url.href = val

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get origin () {
    return this.#url.origin
  }

  set origin (val: string) {
    const REG = /^(http:|https:)?\/\/.+/
    if (!val || !isString(val) || !REG.test((val = val.trim()))) return

    const preValue = this.#getPreValue()
    this.#url.origin = val

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  /* public method */
  assign () {
    warn(true, '小程序环境中调用location.assign()无效.')
  }

  reload () {
    warn(true, '小程序环境中调用location.reload()无效.')
  }

  replace (url: string) {
    this.trigger('__set_href_without_history__', url)
  }

  toString () {
    return this.href
  }

  // For debug
  get cache () {
    return cache
  }
}

export type { TaroLocation }
export const Location: typeof TaroLocation = process.env.TARO_PLATFORM === 'web' ? env.window.Location : TaroLocation

function generateFullUrl (val = '') {
  const origin = INIT_URL
  if (/^[/?#]/.test(val)) {
    return origin + val
  }
  return val
}
