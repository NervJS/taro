import * as ts from "typescript"
import { DocEntry } from "../"

const SymbolFlags = Object.values(ts.SymbolFlags)

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
        } else if (key === 'jsTags') {
          target.jsTags = e.jsTags === target.jsTags ? e.jsTags : (e.jsTags || []).concat(target.jsTags || [])
        } else {
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

export function splicing (arr: (string | undefined)[] = [], lf = '\n') {
  return arr.filter(e => typeof e === 'string').join(lf)
}

export function parseLineFeed (s?: string, isCode = false) {
  if (!s) return ''
  const r = s.split('|').join('or').split('\n').join('<br />')
  return isCode && !s.includes('|') ? `\`${r}\`` : r
}

export function isShowMembers (flags?: ts.SymbolFlags, used: ts.SymbolFlags[] = []) {
  return [
    ts.SymbolFlags.EnumMember,
    ts.SymbolFlags.Function,
    ts.SymbolFlags.Class,
    ts.SymbolFlags.Interface,
    ts.SymbolFlags.ValueModule,
    ts.SymbolFlags.NamespaceModule,
    ts.SymbolFlags.TypeLiteral,
    ts.SymbolFlags.Method,
    ts.SymbolFlags.TypeAlias,
  ].some(v => {
    const e = (flags || -1) - v
    return e > -1 && !used.includes(v) && (e === 0 || isShowMembers(e, [...used, v]))
  })
}

export function isShowAPI (flags?: ts.SymbolFlags) {
  return [
    ts.SymbolFlags.Property,
    ts.SymbolFlags.Method,
    ts.SymbolFlags.Optional + ts.SymbolFlags.Property,
    ts.SymbolFlags.Optional + ts.SymbolFlags.Method,
  ].includes(flags || -1)
}

export function isNotAPI (flags?: ts.SymbolFlags) {
  return [
    -1,
    ts.SymbolFlags.Signature,
    ts.SymbolFlags.TypeParameter,
  ].includes(flags || -1)
}

export function isFunction (flags?: ts.SymbolFlags) {
  return SymbolFlags.includes((flags || -1) - ts.SymbolFlags.Function)
    || SymbolFlags.includes((flags || -1) - ts.SymbolFlags.Method)
}

export function isOptional (flags?: ts.SymbolFlags) {
  return SymbolFlags.includes((flags || -1) - ts.SymbolFlags.Optional)
}