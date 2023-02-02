import { isString, isUndefined } from '@tarojs/shared'

import { parseUrl } from './location'
import { URLSearchParams } from './URLSearchParams'

export class URL {
  static createObjectURL () {
    throw new Error('Oops, not support URL.createObjectURL() in miniprogram.')
  }

  static revokeObjectURL () {
    throw new Error('Oops, not support URL.revokeObjectURL() in miniprogram.')
  }

  /* private property */
  #hash = ''
  #hostname = ''
  #pathname = ''
  #port = ''
  #protocol = ''
  #search = ''

  constructor (url: string, base?: string) {
    if (!isString(url)) url = String(url)

    const parseResult = parseUrlBase(url, base)
    const { hash, hostname, pathname, port, protocol, search } = parseResult

    this.#hash = hash
    this.#hostname = hostname
    this.#pathname = pathname || '/'
    this.#port = port
    this.#protocol = protocol
    this.#search = search
  }

  /* public property */
  get protocol () {
    return this.#protocol
  }

  set protocol (val: string) {
    isString(val) && (this.#protocol = val.trim())
  }

  get host () {
    return this.hostname + (this.port ? ':' + this.port : '')
  }

  set host (val: string) {
    if (val && isString(val)) {
      val = val.trim()
      const { hostname, port } = parseUrl(`//${val}`)
      this.hostname = hostname
      this.port = port
    }
  }

  get hostname () {
    return this.#hostname
  }

  set hostname (val: string) {
    val && isString(val) && (this.#hostname = val.trim())
  }

  get port () {
    return this.#port
  }

  set port (val: string) {
    isString(val) && (this.#port = val.trim())
  }

  get pathname () {
    return this.#pathname
  }

  set pathname (val: string) {
    if (isString(val)) {
      if (val) this.#pathname = val.trim()
      else this.#pathname = '/'
    }
  }

  get search () {
    return this.#search
  }

  set search (val: string) {
    if (isString(val)) {
      val = val.trim()
      if (val) this.#search = val.startsWith('?') ? val : `?${val}`
      else this.#search = ''
    }
  }

  get hash () {
    return this.#hash
  }

  set hash (val: string) {
    if (isString(val)) {
      val = val.trim()
      if (val) this.#hash = val.startsWith('#') ? val : `#${val}`
      else this.#hash = ''
    }
  }

  get href () {
    return `${this.protocol}//${this.host}${this.pathname}${this.search}${this.hash}`
  }

  set href (val: string) {
    if (val && isString(val)) {
      val = val.trim()
      const { protocol, hostname, port, hash, search, pathname } = parseUrl(val)
      this.protocol = protocol
      this.hostname = hostname
      this.pathname = pathname
      this.port = port
      this.hash = hash
      this.search = search
    }
  }

  get origin () {
    return `${this.protocol}//${this.host}`
  }

  set origin (val: string) {
    if (val && isString(val)) {
      val = val.trim()
      const { protocol, hostname, port } = parseUrl(val)
      this.protocol = protocol
      this.hostname = hostname
      this.port = port
    }
  }

  get searchParams () {
    return new URLSearchParams(this.search)
  }

  // public method
  toString () {
    return this.href
  }

  toJSON () {
    return this.toString()
  }

  // convenient for deconstructor
  _toRaw () {
    return {
      protocol: this.protocol,
      port: this.port,
      host: this.host,
      hostname: this.hostname,
      pathname: this.pathname,
      hash: this.hash,
      search: this.search,
      origin: this.origin,
      href: this.href,
    }
  }
}

export function parseUrlBase (url: string, base?: string) {
  const VALID_URL = /^(https?:)\/\//i

  let fullUrl = ''
  let parsedBase: ReturnType<typeof parseUrl> | null = null

  if (!isUndefined(base)) {
    base = String(base).trim()
    if (!VALID_URL.test(base)) throw new TypeError(`Failed to construct 'URL': Invalid base URL`)
    parsedBase = parseUrl(base)
  }

  url = String(url).trim()

  if (VALID_URL.test(url)) {
    fullUrl = url
  } else if (parsedBase) {
    if (url) {
      if (url.startsWith('//')) {
        fullUrl = parsedBase.protocol + url
      } else {
        fullUrl = parsedBase.origin + (url.startsWith('/') ? url : `/${url}`)
      }
    } else {
      fullUrl = parsedBase.href
    }
  } else {
    throw new TypeError(`Failed to construct 'URL': Invalid URL`)
  }

  return parseUrl(fullUrl)
}
