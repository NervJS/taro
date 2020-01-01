import * as ts from "typescript"
import { DocEntry } from "../"

const SymbolFlags = Object.values(ts.SymbolFlags)

export function childrenMerge (d: DocEntry[] = [], o: DocEntry[] = []) {
  d.forEach(e => {
    const name = e.name || 'undefined'
    if (!o.find(v => v.name === name)) o.push(e)
    const target = o.find(v => v.name === name) || {}
    for (const key in e) {
      if (e.hasOwnProperty(key) && e[key] && !['name', 'kind'].includes(key)) {
        if (key === 'flags') {
          if (!target.flags || !isFunction(e.flags)) target.flags = e.flags
        } if (key === 'children') {
          target.children = childrenMerge(e.children, target.children)
        } if (key === 'exports') {
          target.exports = childrenMerge(e.exports, target.exports)
        } else {
          target[key] = e[key]
        }
      }
    }
  })

  return o.map(e => {
    if (e.children) {
      if (!e.exports) e.exports = [];
      e.children.forEach(k => {
        const kk = e.exports!.find(kk => kk.name === k.name)
        if (!kk) e.exports!.push(k)
        else {
          for (const key in k) {
            if (k.hasOwnProperty(key) && !kk[key]) {
              kk[key] = k[key]
            }
          }
        }
      })
      delete e.children
    }
    return e
  })
}

export function splicing (arr: (string | undefined)[] = []) {
  return arr.filter(e => typeof e === 'string').join('\n')
}

export function parseLineFeed (s?: string) {
  return (s || '').split('\n').join('<br />')
}

export function isShowMembers (flags?: ts.SymbolFlags, used: ts.SymbolFlags[] = []) {
  return [
    ts.SymbolFlags.EnumMember,
    ts.SymbolFlags.Function,
    ts.SymbolFlags.Class,
    ts.SymbolFlags.Interface,
    ts.SymbolFlags.ValueModule,
    ts.SymbolFlags.NamespaceModule,
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
}

export function isOptional (flags?: ts.SymbolFlags) {
  return SymbolFlags.includes((flags || -1) - ts.SymbolFlags.Optional)
}