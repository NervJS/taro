import { isString } from '@tarojs/shared'

import { parseUrl } from './location'
import { URLSearchParams } from './URLSearchParams'

export class URL {
  /* private property */
  #hash = ''
  #hostname = ''
  #pathname = ''
  #port = ''
  #protocol = ''
  #search = ''

  constructor (url: string, base = '') {
    if (!isString(url)) url = String(url)
    if (base && !isString(base)) base = String(base)

    const parseResult = parseFullPath(url, base)
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
    isString(val) && (this.#protocol = val)
  }

  get host () {
    return (this.hostname || '') + (this.port ? ':' + this.port : '')
  }

  get hostname () {
    return this.#hostname
  }

  set hostname (val: string) {
    val && isString(val) && (this.#hostname = val)
  }

  get port () {
    return this.#port
  }

  set port (val: string) {
    isString(val) && (this.#port = val)
  }

  get pathname () {
    return this.#pathname
  }

  set pathname (val: string) {
    if (isString(val)) {
      if (val) this.#pathname = val
      else this.#pathname = '/'
    }
  }

  get search () {
    return this.#search
  }

  set search (val: string){
    if(isString(val)){
      if(val) this.#search = val.startsWith('?') ? val : `?${val}`
      else this.#search = ''
    }
  }

  get hash () {
    return this.#hash
  }

  set hash (val: string){
    if(isString(val)){
      if(val) this.#hash = val.startsWith('#') ? val : `#${val}`
      else this.#hash = ''
    }
  }

  get href () {
    return `${this.protocol}//${this.host}${this.pathname}${this.search}${this.hash}`
  }

  get origin () {
    return `${this.protocol}//${this.host}`
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
}

function parseFullPath (url: string, base: string) {
  const VALID_URL = /^(https?:)?\/\//i
  let fullUrl = ''
  if (VALID_URL.test(url)) {
    fullUrl = url
  } else if (VALID_URL.test(base)) {
    const baseUrlObj = parseUrl(base)
    if (url) {
      fullUrl = baseUrlObj.origin + (url.startsWith('/') ? url : `/${url}`)
    } else {
      fullUrl = base
    }
  } else {
    throw new TypeError(`${url} is not a valid URL`)
  }

  return parseUrl(fullUrl)
}
