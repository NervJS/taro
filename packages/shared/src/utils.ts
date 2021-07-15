import { internalComponents } from './components'
import { isArray } from './is'

export const EMPTY_OBJ: any = {}

export const EMPTY_ARR = []

export const noop = (..._: unknown[]) => {}

export const defaultReconciler = Object.create(null)

/**
 * Boxed value.
 *
 * @typeparam T Value type.
 */
export interface Box<T> {
  v: T;
}

/**
 * box creates a boxed value.
 *
 * @typeparam T Value type.
 * @param v Value.
 * @returns Boxed value.
 */
export const box = <T>(v: T) => ({ v })

/**
 * box creates a boxed value.
 *
 * @typeparam T Value type.
 * @param b Boxed value.
 * @returns Value.
 */
export const unbox = <T>(b: Box<T>) => b.v

export function toDashed (s: string) {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

export function toCamelCase (s: string) {
  let camel = ''
  let nextCap = false
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== '-') {
      camel += nextCap ? s[i].toUpperCase() : s[i]
      nextCap = false
    } else {
      nextCap = true
    }
  }
  return camel
}

export const toKebabCase = function (string) {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export function capitalize (s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const hasOwnProperty = Object.prototype.hasOwnProperty

export const hasOwn = (
  val: Record<any, any>,
  key: string | symbol
) => hasOwnProperty.call(val, key)

const reportIssue = '如有疑问，请提交 issue 至：https://github.com/nervjs/taro/issues'

/**
 * ensure takes a condition and throw a error if the condition fails,
 * like failure::ensure: https://docs.rs/failure/0.1.1/failure/macro.ensure.html
 * @param condition condition.
 * @param msg error message.
 */
export function ensure (condition: boolean, msg: string): asserts condition {
  if (!condition) {
    throw new Error(msg + '\n' + reportIssue)
  }
}

export function warn (condition: boolean, msg: string) {
  if (process.env.NODE_ENV !== 'production') {
    if (condition) {
      console.warn(`[taro warn] ${msg}`)
    }
  }
}

export function queryToJson (str) {
  const dec = decodeURIComponent
  const qp = str.split('&')
  const ret = {}
  let name
  let val
  for (let i = 0, l = qp.length, item; i < l; ++i) {
    item = qp[i]
    if (item.length) {
      const s = item.indexOf('=')
      if (s < 0) {
        name = dec(item)
        val = ''
      } else {
        name = dec(item.slice(0, s))
        val = dec(item.slice(s + 1))
      }
      if (typeof ret[name] === 'string') { // inline'd type check
        ret[name] = [ret[name]]
      }

      if (Array.isArray(ret[name])) {
        ret[name].push(val)
      } else {
        ret[name] = val
      }
    }
  }
  return ret // Object
}

let _uniqueId = 1
const _loadTime = (new Date()).getTime().toString()

export function getUniqueKey () {
  return _loadTime + (_uniqueId++)
}

const cacheData = {}

export function cacheDataSet (key, val) {
  cacheData[key] = val
}

export function cacheDataGet (key, delelteAfterGet?) {
  const temp = cacheData[key]
  delelteAfterGet && delete cacheData[key]
  return temp
}

export function cacheDataHas (key) {
  return key in cacheData
}

export function mergeInternalComponents (components) {
  Object.keys(components).forEach(name => {
    if (name in internalComponents) {
      Object.assign(internalComponents[name], components[name])
    } else {
      internalComponents[name] = components[name]
    }
  })
}

export function mergeReconciler (hostConfig) {
  Object.keys(hostConfig).forEach(key => {
    const value = hostConfig[key]
    const raw = defaultReconciler[key]
    if (!raw) {
      defaultReconciler[key] = value
    } else {
      if (isArray(raw)) {
        defaultReconciler[key] = raw.push(value)
      } else {
        defaultReconciler[key] = [raw, value]
      }
    }
  })
}

export function unsupport (api) {
  return function () {
    console.warn(`小程序暂不支持 ${api}`)
  }
}

export function setUniqueKeyToRoute (key: string, obj) {
  const routerParamsPrivateKey = '__key_'
  const useDataCacheApis = [
    'navigateTo',
    'redirectTo',
    'reLaunch',
    'switchTab'
  ]

  if (useDataCacheApis.indexOf(key) > -1) {
    const url = obj.url = obj.url || ''
    const hasMark = url.indexOf('?') > -1
    const cacheKey = getUniqueKey()
    obj.url += (hasMark ? '&' : '?') + `${routerParamsPrivateKey}=${cacheKey}`
  }
}
