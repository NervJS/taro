import { Events } from '../emitter/emitter'
import { isString, isNumber } from '@tarojs/shared'
// import Taro from '@tarojs/taro'

// TODO: 可以获取到当前app, router, page
import { getCurrentInstance } from '../current'

type PreValue = {
  protocol: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
}

type Options = {
  win: any
}

// TODO: 选择更好的实现方式
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

function getMatchPage (pages: string[], pathname: string) {
  pathname = pathname.replace(/^\//, '')
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].indexOf(pathname) > -1) return pages[i]
  }
  return ''
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
  __hash = ''
  __hostname = ''
  __pathname = '/'
  __port = ''
  __protocol = 'https:'
  __search = ''

  win: any
  realPathname = ''

  constructor (options: Options) {
    super()

    this.win = options.win

    Promise.resolve().then(() => {
      this.__reset()
      // console.log('preValue', this.__getPreValue())
    })
  }

  /* private method */
  __reset () {
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
      this.__protocol = protocol
      this.__hostname = hostname
      this.__port = port
      this.__pathname = pathname
      this.__search = search
      this.__hash = hash

      this.trigger('__reset_history__', this.href)
    }
  }

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

  __rollBack (preValue: PreValue) {
    this.__protocol = preValue.protocol
    this.__hostname = preValue.hostname
    this.__port = preValue.port
    this.__pathname = preValue.pathname
    this.__search = preValue.search
    this.__hash = preValue.hash
  }

  __recordHistory () {
    this.trigger('__record_history__', this.href)
  }

  __checkUrlChange (preValue: PreValue) {
    const Current = getCurrentInstance()
    // const router = Current.router
    // console.log('router结果', router, 'Current:', Current, 'now:', this.__getPreValue())

    // 跨域三要素不允许修改
    if (this.__protocol !== preValue.protocol || this.__hostname !== preValue.hostname || this.port !== preValue.port) {
      this.__rollBack(preValue)
      return false
    }

    // 页面跳转
    if (this.__pathname !== preValue.pathname || this.__search !== preValue.search) {
      const app = Current.app
      const pages = app?.config?.pages ?? []
      if (pages.length > 0) {
        // console.log('this.__pathname', this.__pathname)
        const matchPage = getMatchPage(pages, this.__pathname)
        if (matchPage) {
          const url = `${this.realPathname ? this.realPathname : this.__pathname}${this.__search ? this.__search : ''}`
          this.realPathname = ''
          this.win.Taro.redirectTo({ url }).then(() => {
            this.__reset()
          })
          return true
        }
      }
    }

    // hashchange
    if (this.__hash !== preValue.hash) {
      this.win.trigger('hashchange')
      return true
    }

    this.__rollBack(preValue)
    return false
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

    if (this.__checkUrlChange(preValue)) this.__recordHistory()
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

    if (this.__checkUrlChange(preValue)) this.__recordHistory()
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

    if (this.__checkUrlChange(preValue)) this.__recordHistory()
  }

  get port () {
    return this.__port
  }

  set port (val: string) {
    const xVal = Number((val = val.trim()))
    if (!isNumber(xVal) || xVal <= 0) return
    if (val === this.__port) return

    const preValue = this.__getPreValue()

    this.__port = val

    if (this.__checkUrlChange(preValue)) this.__recordHistory()
  }

  get pathname () {
    return this.__pathname
  }

  set pathname (val: string) {
    if (!val || !isString(val)) return
    val = val.trim()

    const preValue = this.__getPreValue()

    let newPathName = ''
    if (val.startsWith('/')) {
      newPathName = this.__pathname + val
    } else if (val.startsWith('./')) {
      val = val.replace(/\.\//, '/')
      newPathName = this.__pathname + val
    } else if (val.startsWith('../')) {
      this.realPathname = val
      newPathName = resolveRelativePath(val, preValue.pathname)
    }

    const { pathname, search, hash } = parseUrl(`//taro.com${newPathName}`)

    this.__pathname = pathname
    this.__search = search
    this.__hash = hash

    if (this.__checkUrlChange(preValue)) this.__recordHistory()
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

    if (this.__checkUrlChange(preValue)) this.__recordHistory()
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

    if (this.__checkUrlChange(preValue)) this.__recordHistory()
  }

  get href () {
    return `${this.__protocol}//${this.host}${this.__pathname}${this.__search}${this.__hash}`
  }

  set href (val: string) {
    const reg = /^(http:|https:)?\/\/.+/
    if (!val || !isString(val) || !reg.test((val = val.trim()))) return

    const { protocol, hostname, port, hash, search, pathname } = parseUrl(val)
    const preValue = this.__getPreValue()

    this.__protocol = protocol
    this.__hostname = hostname
    this.__port = port
    this.__pathname = pathname
    this.__search = search
    this.__hash = hash

    if (this.__checkUrlChange(preValue)) this.__recordHistory()
  }

  get origin () {
    return `${this.__protocol}//${this.host}`
  }

  set origin (val: string) {
    const reg = /^(http:|https:)?\/\/.+/
    if (!val || !isString(val) || !reg.test((val = val.trim()))) return

    const { protocol, hostname, port } = parseUrl(val)
    const preValue = this.__getPreValue()

    this.__protocol = protocol
    this.__hostname = hostname
    this.__port = port

    if (this.__checkUrlChange(preValue)) this.__recordHistory()
  }

  /* public method */
  assign () {}
  reload () {}
  replace () {}
  toString () {
    return this.href
  }
}
