import { Events } from '../emitter/emitter'
import { isString, isNumber } from '@tarojs/shared'

type PreValue = {
  protocol: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
}

function parseUrl(url = ''){
  const result = { href: '', origin: '', protocol: '', hostname: '', host: '', port: '', pathname: '', search: '', hash: '' }
  if(!url || !isString(url)) return result

  url = url.trim()
  const PATTERN = /^(([^:/?#]+):)?\/\/(([^/?#]+):(.+)@)?([^/?#:]*)(:(\d+))?([^?#]*)(\?([^#]*))?(#(.*))?/,
        matches = url.match(PATTERN)

  if(!matches) return result

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
  #hash: string = ''
  #hostname: string = ''
  #pathname: string = '/'
  #port: string = ''
  #protocol: string = 'https:'
  #search: string = ''

  #lastHref: string = ''

  /* private method */
  #getPreValue(): PreValue{
    return {
      protocol: this.#protocol,
      hostname: this.#hostname,
      port: this.#port,
      pathname: this.#pathname,
      search: this.#search,
      hash: this.#hash
    }
  }
  #recordHistory(){
    this.trigger('__record_history__', this.href)
  }
  #triggerHashChange(){
    // TODO: 触发全局hashchange事件
  }
  #checkUrlChange(preValue: PreValue){
    return !preValue
  }


  /* public property */
  get protocol(){
    return this.#protocol
  }
  set protocol(val: string){
    const reg = /^(http|https):?$/i
    if(!val || !isString(val) || !reg.test(val.trim())) return

    val = val.trim()
    const preValue = this.#getPreValue()

    this.#protocol = val.endsWith(':') ? val : `${val}:`

    this.#checkUrlChange(preValue)
  }

  get host(){
    return (this.#hostname || '') + (this.#port ? ':' + this.#port : '')
  }
  set host(val: string){
    if(!val || !isString(val)) return
    val = val.trim()

    const { hostname, port } = parseUrl(`//${val}`)
    const preValue = this.#getPreValue()

    this.#hostname = hostname
    this.#port = port

    this.#checkUrlChange(preValue)
  }

  get hostname(){
    return this.#hostname
  }
  set hostname(val: string){
    if(!val || !isString(val)) return
    val = val.trim()

    const { hostname } = parseUrl(`//${val}`)
    const preValue = this.#getPreValue()

    this.#hostname = hostname

    this.#checkUrlChange(preValue)
  }

  get port(){
    return this.#port
  }
  set port(val: string){
    let xVal = Number(val = val.trim())
    if(!isNumber(xVal) || xVal <= 0) return
    if(val === this.#port) return

    const preValue = this.#getPreValue()

    this.#port = val

    this.#checkUrlChange(preValue)
  }

  get pathname(){
    return this.#pathname
  }
  set pathname(val: string){
    if(!val || !isString(val)) return
    val = val.trim()

    val = val.startsWith('/') ? val : `/${val}`

    const preValue = this.#getPreValue()
    const { pathname } = parseUrl(`//taro.com${val}`)

    this.#pathname = pathname

    this.#checkUrlChange(preValue)
  }

  get search(){
    return this.#search
  }
  set search(val: string){
    if(!val || !isString(val)) return
    val = val.trim()

    val = val.startsWith('?') ? val : `?${val}`
    const preValue = this.#getPreValue()
    const { search } = parseUrl(`//taro.com${val}`)

    this.#search = search

    this.#checkUrlChange(preValue)
  }

  get hash(){
    return this.#hash
  }
  set hash(val: string){
    if(!val || !isString(val)) return
    val = val.trim()

    val = val.startsWith('#') ? val : `#${val}`
    const preValue = this.#getPreValue()
    const { hash } = parseUrl(`//taro.com${val}`)

    this.#hash = hash

    this.#checkUrlChange(preValue)
  }

  get href(){
    return `${this.#protocol}//${this.host}${this.#pathname}${this.#search}${this.#hash}`
  }
  set href(val: string){
    const reg = /^(http:|https:)?\/\/.+/
    if(!val || !isString(val) || !reg.test(val = val.trim())) return

    const {
      protocol, hostname, port, hash, search, pathname
    } = parseUrl(val)
    const preValue = this.#getPreValue()

    this.#protocol = protocol
    this.#hostname = hostname
    this.#port = port
    this.#pathname = pathname
    this.#search = search
    this.#hash = hash

    this.#checkUrlChange(preValue)
  }

  get origin(){
    return `${this.#protocol}//${this.host}`
  }
  set origin(val: string){
    const reg = /^(http:|https:)?\/\/.+/
    if(!val || !isString(val) || !reg.test(val = val.trim())) return

    const {protocol, hostname, port} = parseUrl(val)
    const preValue = this.#getPreValue()

    this.#protocol = protocol
    this.#hostname = hostname
    this.#port = port

    this.#checkUrlChange(preValue)
  }

  /* public method */
  assign(){}
  reload(){}
  replace(){}
  toString(){
    return this.href
  }
}
