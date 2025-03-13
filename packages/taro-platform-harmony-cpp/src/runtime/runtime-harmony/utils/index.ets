import type { TaroAny, TaroObject } from '@tarojs/runtime'

export function setParamFromObj (obj: Record<string, string | number>, params: TaroAny): TaroAny {
  if (!obj) return params

  Object.keys(obj).forEach(key => {
    params[key] = obj[key]
  })

  return params
}

function safeDecode (str: string) {
  try {
    return decodeURIComponent(str)
  } catch (e) {
    return str
  }
}

export function queryToJson(str: string) {
  const qp = str.split('&')
  const ret: TaroObject = {}
  let name: string
  let val: string
  for (let i = 0, l = qp.length, item: string; i < l; ++i) {
    item = qp[i]
    if (item.length) {
      const s: number = item.indexOf('=')
      if (s < 0) {
        name = safeDecode(item)
        val = ''
      } else {
        name = safeDecode(item.slice(0, s))
        val = safeDecode(item.slice(s + 1))
      }
      if (typeof ret[name] === 'string') {
        // inline'd type check
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

export * from './info'
export * from './object'
