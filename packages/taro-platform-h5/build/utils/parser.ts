import { isFunction } from './helper'

import type { DocEntry } from './ast'

export async function childrenMerge (d: DocEntry[] = [], o: DocEntry[] = []) {
  for (const e of d) {
    const name = e.name || 'undefined'
    if (!o.find(v => v.name === name)) o.push(e)
    const target = o.find(v => v.name === name) || {}
    for (const key in e) {
      if (e.hasOwnProperty(key) && e[key] && !['name', 'kind'].includes(key)) {
        if (key === 'flags') {
          if (!target.flags || !isFunction(e.flags)) target.flags = e.flags
        } else if (key === 'children') {
          target.children = await childrenMerge(e.children, target.children)
        } else if (key === 'exports') {
          target.exports = await childrenMerge(e.exports, target.exports)
          target[key] = e[key] || target[key]
        }
      }
    }
  }

  return o.map(e => {
    if (e.children) {
      if (!e.exports) e.exports = []
      for (const k of e.children) {
        const kk = e.exports!.find(kk => kk.name === k.name)
        if (!kk) {
          e.exports!.push(k)
        } else {
          for (const key in k) {
            if (k.hasOwnProperty(key) && !kk[key]) {
              kk[key] = k[key]
            }
          }
        }
      }
      delete e.children
    }
    return e
  })
}
