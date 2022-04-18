import { Events } from '../emitter/emitter'
import { isString, isNumber } from '@tarojs/shared'

// TODO: 可以获取到当前app, router, page
// import { getCurrentInstance } from '../current'

type PreValue = {
  protocol: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
}

function parseUrl (url = '') {
  const result = { href: '', origin: '', protocol: '', hostname: '', host: '', port: '', pathname: '', search: '', hash: '' }
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
  __hash = ''
  __hostname = ''
  __pathname = '/'
  __port = ''
  __protocol = 'https:'
  __search = ''

  /* private method */
  __getPreValue (): PreValue {
    return {
      protocol: this.__protocol,
      hostname: this.__hostname,
      port: this.__port,
      pathname: this.__pathname,
      search: this.__search,
      hash: this.__hash
    }
  }

  // __recordHistory(){
  //   this.trigger('__record_history__', this.href)
  // }
  // __triggerHashChange(){
  //   // TODO: 触发全局hashchange事件
  // }
  __checkUrlChange (preValue: PreValue) {
    return !preValue
  }

  /* public property */
  get protocol () {
    return this.__protocol
  }

  set protocol (val: string) {
    const reg = /^(http|https):?$/i
    if (!val || !isString(val) || !reg.test(val.trim())) return

    val = val.trim()
    const preValue = this.__getPreValue()

    this.__protocol = val.endsWith(':') ? val : `${val}:`

    this.__checkUrlChange(preValue)
  }

  get host () {
    return (this.__hostname || '') + (this.__port ? ':' + this.__port : '')
  }

  set host (val: string) {
    if (!val || !isString(val)) return
    val = val.trim()

    const { hostname, port } = parseUrl(`//${val}`)
    const preValue = this.__getPreValue()

    this.__hostname = hostname
    this.__port = port

    this.__checkUrlChange(preValue)
  }

  get hostname () {
    return this.__hostname
  }

  set hostname (val: string) {
    if (!val || !isString(val)) return
    val = val.trim()

    const { hostname } = parseUrl(`//${val}`)
    const preValue = this.__getPreValue()

    this.__hostname = hostname

    this.__checkUrlChange(preValue)
  }

  get port () {
    return this.__port
  }

  set port (val: string) {
    const xVal = Number(val = val.trim())
    if (!isNumber(xVal) || xVal <= 0) return
    if (val === this.__port) return

    const preValue = this.__getPreValue()

    this.__port = val

    this.__checkUrlChange(preValue)
  }

  get pathname () {
    return this.__pathname
  }

  set pathname (val: string) {
    if (!val || !isString(val)) return
    val = val.trim()

    val = val.startsWith('/') ? val : `/${val}`

    const preValue = this.__getPreValue()
    const { pathname } = parseUrl(`//taro.com${val}`)

    this.__pathname = pathname

    this.__checkUrlChange(preValue)
  }

  get search () {
    return this.__search
  }

  set search (val: string) {
    if (!val || !isString(val)) return
    val = val.trim()

    val = val.startsWith('?') ? val : `?${val}`
    const preValue = this.__getPreValue()
    const { search } = parseUrl(`//taro.com${val}`)

    this.__search = search

    this.__checkUrlChange(preValue)
  }

  get hash () {
    return this.__hash
  }

  set hash (val: string) {
    if (!val || !isString(val)) return
    val = val.trim()

    val = val.startsWith('#') ? val : `#${val}`
    const preValue = this.__getPreValue()
    const { hash } = parseUrl(`//taro.com${val}`)

    this.__hash = hash

    this.__checkUrlChange(preValue)
  }

  get href () {
    return `${this.__protocol}//${this.host}${this.__pathname}${this.__search}${this.__hash}`
  }

  set href (val: string) {
    const reg = /^(http:|https:)?\/\/.+/
    if (!val || !isString(val) || !reg.test(val = val.trim())) return

    const {
      protocol, hostname, port, hash, search, pathname
    } = parseUrl(val)
    const preValue = this.__getPreValue()

    this.__protocol = protocol
    this.__hostname = hostname
    this.__port = port
    this.__pathname = pathname
    this.__search = search
    this.__hash = hash

    this.__checkUrlChange(preValue)
  }

  get origin () {
    return `${this.__protocol}//${this.host}`
  }

  set origin (val: string) {
    const reg = /^(http:|https:)?\/\/.+/
    if (!val || !isString(val) || !reg.test(val = val.trim())) return

    const { protocol, hostname, port } = parseUrl(val)
    const preValue = this.__getPreValue()

    this.__protocol = protocol
    this.__hostname = hostname
    this.__port = port

    this.__checkUrlChange(preValue)
  }

  /* public method */
  assign () {}
  reload () {}
  replace () {}
  toString () {
    return this.href
  }
}
