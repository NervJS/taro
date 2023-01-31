import { isNumber, isString, warn } from '@tarojs/shared'

import { CONTEXT_ACTIONS } from '../constants'
import { getCurrentInstance } from '../current'
import { Events } from '../emitter/emitter'
import { RuntimeCache } from '../utils/cache'

const DEFAULT_HOSTNAME = 'taro.com'

type PreValue = {
  protocol: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
}

type Options = {
  window: any
}
type LocationContext = {
  lastHref: string
}

const cache = new RuntimeCache<LocationContext>('location')

export class Location extends Events {
  /* private property */
  #hash = ''
  #hostname = DEFAULT_HOSTNAME
  #pathname = '/'
  #port = ''
  #protocol = 'https:'
  #search = ''

  #noCheckUrl = false
  #window: any

  constructor (options: Options) {
    super()

    this.#window = options.window

    this.#reset()

    this.on('__set_href_without_history__', (href: string) => {
      this.#noCheckUrl = true

      const lastHash = this.#hash
      this.href = generateFullUrl(href)
      if (lastHash !== this.#hash) {
        this.#window.trigger('hashchange')
      }

      this.#noCheckUrl = false
    }, null)

    // 切换上下文行为

    this.on(CONTEXT_ACTIONS.INIT, () => {
      this.#reset()
    }, null)

    this.on(CONTEXT_ACTIONS.RESTORE, (pageId: string) => {
      cache.set(pageId, {
        lastHref: this.href
      })
    }, null)

    this.on(CONTEXT_ACTIONS.RECOVER, (pageId: string) => {
      // 数据恢复时，不需要执行跳转
      if (cache.has(pageId)) {
        const ctx = cache.get(pageId)!
        this.#noCheckUrl = true
        this.href = ctx.lastHref
        this.#noCheckUrl = false
      }
    }, null)

    this.on(CONTEXT_ACTIONS.DESTORY, (pageId: string) => {
      cache.delete(pageId)
    }, null)
  }

  /* private method */
  #reset () {
    const Current = getCurrentInstance()
    const router = Current.router
    if (router) {
      const { path, params } = router
      const searchArr = Object.keys(params).map(key => {
        return `${key}=${params[key]}`
      })
      const searchStr = searchArr.length > 0 ? '?' + searchArr.join('&') : ''
      const url = `https://${DEFAULT_HOSTNAME}${path.startsWith('/') ? path : '/' + path}${searchStr}`
      // 初始化页面链接时，默认pathname为 "/"
      // const url = `https://${DEFAULT_HOSTNAME}${searchStr}`
      const { protocol, hostname, port, pathname, search, hash } = parseUrl(url)
      this.#protocol = protocol
      this.#hostname = hostname
      this.#port = port
      this.#pathname = pathname
      this.#search = search
      this.#hash = hash

      this.trigger('__reset_history__', this.href)
    }
  }

  #getPreValue (): PreValue {
    return {
      protocol: this.#protocol,
      hostname: this.#hostname,
      port: this.#port,
      pathname: this.#pathname,
      search: this.#search,
      hash: this.#hash
    }
  }

  #rollBack (preValue: PreValue) {
    this.#protocol = preValue.protocol
    this.#hostname = preValue.hostname
    this.#port = preValue.port
    this.#pathname = preValue.pathname
    this.#search = preValue.search
    this.#hash = preValue.hash
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

    // 跨域三要素不允许修改
    if (this.#protocol !== preValue.protocol || this.#hostname !== preValue.hostname || this.port !== preValue.port) {
      this.#rollBack(preValue)
      return false
    }

    // pathname
    if (this.#pathname !== preValue.pathname) {
      return true
    }

    // search
    if (this.#search !== preValue.search) {
      return true
    }

    // hashchange
    if (this.#hash !== preValue.hash) {
      this.#window.trigger('hashchange')
      return true
    }

    this.#rollBack(preValue)
    return false
  }

  /* public property */
  get protocol () {
    return this.#protocol
  }

  set protocol (val: string) {
    const reg = /^(http|https):?$/i
    if (!val || !isString(val) || !reg.test(val.trim())) return

    val = val.trim()
    const preValue = this.#getPreValue()

    this.#protocol = val.endsWith(':') ? val : `${val}:`

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get host () {
    return (this.#hostname || '') + (this.#port ? ':' + this.#port : '')
  }

  set host (val: string) {
    if (!val || !isString(val)) return
    val = val.trim()

    const { hostname, port } = parseUrl(`//${val}`)
    const preValue = this.#getPreValue()

    this.#hostname = hostname
    this.#port = port

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get hostname () {
    return this.#hostname
  }

  set hostname (val: string) {
    if (!val || !isString(val)) return
    val = val.trim()

    const { hostname } = parseUrl(`//${val}`)
    const preValue = this.#getPreValue()

    this.#hostname = hostname

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get port () {
    return this.#port
  }

  set port (val: string) {
    const xVal = Number((val = val.trim()))
    if (!isNumber(xVal) || xVal <= 0) return
    if (val === this.#port) return

    const preValue = this.#getPreValue()

    this.#port = val

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get pathname () {
    return this.#pathname
  }

  set pathname (val: string) {
    if (!val || !isString(val)) return
    val = val.trim()

    const preValue = this.#getPreValue()

    let newPathName = ''
    if (val.startsWith('/')) {
      newPathName = this.#pathname + val
    } else if (val.startsWith('./')) {
      val = val.replace(/\.\//, '/')
      newPathName = this.#pathname + val
    } else if (val.startsWith('../')) {
      newPathName = resolveRelativePath(val, preValue.pathname)
    }

    const { pathname, search, hash } = parseUrl(`//${DEFAULT_HOSTNAME}${newPathName}`)

    this.#pathname = pathname
    this.#search = search
    this.#hash = hash

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get search () {
    return this.#search
  }

  set search (val: string) {
    if (!val || !isString(val)) return
    val = val.trim()

    val = val.startsWith('?') ? val : `?${val}`
    const preValue = this.#getPreValue()
    const { search } = parseUrl(`//${DEFAULT_HOSTNAME}${val}`)

    this.#search = search

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get hash () {
    return this.#hash
  }

  // 小程序的navigateTo存在截断hash字符串的问题
  set hash (val: string) {
    if (!val || !isString(val)) return
    val = val.trim()

    val = val.startsWith('#') ? val : `#${val}`
    const preValue = this.#getPreValue()
    const { hash } = parseUrl(`//${DEFAULT_HOSTNAME}${val}`)

    this.#hash = hash

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get href () {
    return `${this.#protocol}//${this.host}${this.#pathname}${this.#search}${this.#hash}`
  }

  set href (val: string) {
    const reg = /^(http:|https:)?\/\/.+/
    if (!val || !isString(val) || !reg.test((val = val.trim()))) return

    const { protocol, hostname, port, hash, search, pathname } = parseUrl(val)
    const preValue = this.#getPreValue()

    this.#protocol = protocol
    this.#hostname = hostname
    this.#port = port
    this.#pathname = pathname
    this.#search = search
    this.#hash = hash

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get origin () {
    return `${this.#protocol}//${this.host}`
  }

  set origin (val: string) {
    const reg = /^(http:|https:)?\/\/.+/
    if (!val || !isString(val) || !reg.test((val = val.trim()))) return

    const { protocol, hostname, port } = parseUrl(val)
    const preValue = this.#getPreValue()

    this.#protocol = protocol
    this.#hostname = hostname
    this.#port = port

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  /* public method */
  assign () {
    warn(true, '小程序环境中调用location.assign()无效.')
  }

  reload () {
    warn(true, '小程序环境中调用location.reload()无效.')
  }

  replace (val: string) {
    this.trigger('__set_href_without_history__', val)
  }

  toString () {
    return this.href
  }

  // For debug
  get cache () {
    return cache
  }
}

export function resolveRelativePath (path: string, relative: string): string {
  const relativeArr = relative.split('/')
  const parent = relativeArr.slice(0, relativeArr.length - 1)
  let depth = 0
  const dests = path.split('../').map(v => {
    v === '' && depth++
    return v
  })

  if (depth > parent.length) return relative

  return parent.slice(0, parent.length - depth).concat(dests.filter(v => v !== '')).join('/')
}

function generateFullUrl (val = '') {
  const origin = `https://${DEFAULT_HOSTNAME}`
  if (val.startsWith('/')) {
    return origin + val
  }
  if (val.startsWith('?')) {
    return origin + val
  }
  if (val.startsWith('#')) {
    return origin + val
  }
  if (/(https?:)?\/\//.test(val)) {
    return val
  }
  return val
}

export function parseUrl (url = '') {
  const result = {
    href: '',
    origin: '',
    protocol: '',
    hostname: '',
    host: '',
    port: '',
    pathname: '',
    search: '',
    hash: ''
  }
  if (!url || !isString(url)) return result

  url = url.trim()
  const PATTERN = /^(([^:/?#]+):)?\/\/(([^/?#]+):(.+)@)?([^/?#:]*)(:(\d+))?([^?#]*)(\?([^#]*))?(#(.*))?/
  const matches = url.match(PATTERN)

  if (!matches) return result

  result.protocol = matches[1] || 'https:'
  result.hostname = matches[6] || DEFAULT_HOSTNAME
  result.port = matches[8] || ''
  result.pathname = matches[9] || '/'
  result.search = matches[10] || ''
  result.hash = matches[12] || ''
  result.href = url
  result.origin = result.protocol + '//' + result.hostname
  result.host = result.hostname + (result.port ? `:${result.port}` : '')

  return result
}
