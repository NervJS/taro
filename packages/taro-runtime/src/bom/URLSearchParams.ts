import { isArray } from '@tarojs/shared'

import env from '../env'

const findReg = /[!'()~]|%20|%00/g
const plusReg = /\+/g
const replaceCharMap = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+',
  '%00': '\x00',
}

function replacer (match: string) {
  return replaceCharMap[match]
}

function appendTo (dict: Record<string, string[]>, name: string, value: string) {
  const res = isArray(value) ? value.join(',') : value
  if (name in dict) dict[name].push(res)
  else dict[name] = [res]
}

function addEach (value: string, key: string) {
  appendTo(this, key, value)
}

function decode (str: string) {
  return decodeURIComponent(str.replace(plusReg, ' '))
}

function encode (str: string) {
  return encodeURIComponent(str).replace(findReg, replacer)
}

export const URLSearchParams = process.env.TARO_PLATFORM === 'web' ? env.window.URLSearchParams : class {
  #dict = Object.create(null)

  constructor (query) {
    query ??= ''

    const dict = this.#dict

    if (typeof query === 'string') {
      if (query.charAt(0) === '?') {
        query = query.slice(1)
      }
      for (let pairs = query.split('&'), i = 0, length = pairs.length; i < length; i++) {
        const value = pairs[i]
        const index = value.indexOf('=')

        // 针对不规范的 url 参数做容错处理，如：word=你%好
        try {
          if (index > -1) {
            appendTo(dict, decode(value.slice(0, index)), decode(value.slice(index + 1)))
          } else if (value.length) {
            appendTo(dict, decode(value), '')
          }
        } catch (err) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`[Taro warn] URL 参数 ${value} decode 异常`)
          }
        }
      }
    } else {
      if (isArray(query)) {
        for (let i = 0, length = query.length; i < length; i++) {
          const value = query[i]
          appendTo(dict, value[0], value[1])
        }
      } else if (query.forEach) {
        query.forEach(addEach, dict)
      } else {
        for (const key in query) {
          appendTo(dict, key, query[key])
        }
      }
    }
  }

  append (name: string, value: string) {
    appendTo(this.#dict, name, value)
  }

  delete (name: string) {
    delete this.#dict[name]
  }

  get (name: string) {
    const dict = this.#dict
    return name in dict ? dict[name][0] : null
  }

  getAll (name: string) {
    const dict = this.#dict
    return name in dict ? dict[name].slice(0) : []
  }

  has (name: string) {
    return name in this.#dict
  }

  keys () {
    return Object.keys(this.#dict)
  }

  set (name: string, value: string) {
    this.#dict[name] = ['' + value]
  }

  forEach (callback, thisArg) {
    const dict = this.#dict
    Object.getOwnPropertyNames(dict).forEach(function (name) {
      dict[name].forEach(function (value: string) {
        callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  toJSON () {
    return {}
  }

  toString () {
    const dict = this.#dict
    const query: any[] = []
    for (const key in dict) {
      const name = encode(key)
      for (let i = 0, value = dict[key]; i < value.length; i++) {
        query.push(name + '=' + encode(value[i]))
      }
    }
    return query.join('&')
  }
}
