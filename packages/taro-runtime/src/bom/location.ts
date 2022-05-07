import { isString, isNumber } from '@tarojs/shared'
import { Events } from '../emitter/emitter'
import { getCurrentInstance } from '../current'

// export enum LocationAction {

// }

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

function resolveRelativePath (path, relative): string {
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
  const origin = 'https://taro.com'
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

function parseUrl (url = '') {
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
  result.hostname = matches[6] || ''
  result.port = matches[8] || ''
  result.pathname = matches[9] || '/'
  result.search = matches[10] || ''
  result.hash = matches[12] || ''
  result.href = url
  result.origin = result.protocol + '//' + result.hostname
  result.host = result.hostname + (result.port ? `:${result.port}` : '')

  return result
}

export class Location extends Events {
  /* private property */
  #hash = ''
  #hostname = ''
  #pathname = '/'
  #port = ''
  #protocol = 'https:'
  #search = ''

  #oldHref = ''
  #noCheckUrl = false
  #window: any

  constructor (options: Options) {
    super()

    this.#window = options.window

    this.#reset()

    this.on('__recover_location__', () => {
      // 数据恢复时，不需要执行跳转
      this.#noCheckUrl = true
      this.href = this.#oldHref
      this.#noCheckUrl = false
    }, null)

    this.on('__set_href_without_history__', (href: string) => {
      this.#noCheckUrl = true
      this.href = generateFullUrl(href)
      this.#noCheckUrl = false
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
      const url = `https://taro.com${path.startsWith('/') ? path : '/' + path}${searchStr}`
      const { protocol, hostname, port, pathname, search, hash } = parseUrl(url)
      this.#protocol = protocol
      this.#hostname = hostname
      this.#port = port
      this.#pathname = pathname
      this.#search = search
      this.#hash = hash

      this.#oldHref = this.href

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
   * 校验url的变化，判断是否需要跳转
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
    this.#oldHref = this.href

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
    this.#oldHref = this.href

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
    this.#oldHref = this.href

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
    this.#oldHref = this.href

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
    this.#oldHref = this.href

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

    const { pathname, search, hash } = parseUrl(`//taro.com${newPathName}`)

    this.#pathname = pathname
    this.#search = search
    this.#hash = hash

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get search () {
    return this.#search
  }

  set search (val: string) {
    this.#oldHref = this.href

    if (!val || !isString(val)) return
    val = val.trim()

    val = val.startsWith('?') ? val : `?${val}`
    const preValue = this.#getPreValue()
    const { search } = parseUrl(`//taro.com${val}`)

    this.#search = search

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get hash () {
    return this.#hash
  }

  // 小程序的navigateTo存在截断hash字符串的问题
  set hash (val: string) {
    this.#oldHref = this.href

    if (!val || !isString(val)) return
    val = val.trim()

    val = val.startsWith('#') ? val : `#${val}`
    const preValue = this.#getPreValue()
    const { hash } = parseUrl(`//taro.com${val}`)

    this.#hash = hash

    if (this.#checkUrlChange(preValue)) this.#recordHistory()
  }

  get href () {
    return `${this.#protocol}//${this.host}${this.#pathname}${this.#search}${this.#hash}`
  }

  set href (val: string) {
    !this.#noCheckUrl && (this.#oldHref = this.href)

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
    this.#oldHref = this.href

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
  assign () {}
  reload () {}
  replace (val: string) {
    this.trigger('__set_href_without_history__', val)
  }

  toString () {
    return this.href
  }
}
