import type { TaroAny } from '@tarojs/runtime'

export function setParamFromObj (obj: Record<string, string | number>, params: TaroAny) {
  if (!obj) return params

  Object.keys(obj).forEach(key => {
    params[key] = obj[key]
  })

  return params
}

export function assignObject (target: TaroAny, source: TaroAny) {
  return Object.assign(target, source)
}

function safeDecode (str) {
  try {
    return decodeURIComponent(str)
  } catch (e) {
    return str
  }
}

export function queryToJson(str) {
  const qp = str.split('&')
  const ret = {}
  let name
  let val
  for (let i = 0, l = qp.length, item; i < l; ++i) {
    item = qp[i]
    if (item.length) {
      const s = item.indexOf('=')
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
