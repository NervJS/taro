import ts from 'typescript'

const SymbolFlags = Object.values(ts.SymbolFlags)

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

export function isShowAPI (flags?: ts.SymbolFlags): flags is ts.SymbolFlags.Property | ts.SymbolFlags.Method {
  return [
    ts.SymbolFlags.Property,
    ts.SymbolFlags.Method,
    ts.SymbolFlags.Optional + ts.SymbolFlags.Property,
    ts.SymbolFlags.Optional + ts.SymbolFlags.Method,
  ].includes(flags || -1)
}

export function isNotAPI (flags?: ts.SymbolFlags): flags is ts.SymbolFlags.Signature | ts.SymbolFlags.TypeParameter {
  return [
    -1,
    ts.SymbolFlags.Signature,
    ts.SymbolFlags.TypeParameter,
  ].includes(flags || -1)
}

export function isFunction (flags?: ts.SymbolFlags): flags is ts.SymbolFlags.Function | ts.SymbolFlags.Method {
  return SymbolFlags.includes((flags || -1) - ts.SymbolFlags.Function) ||
    SymbolFlags.includes((flags || -1) - ts.SymbolFlags.Method)
}

export function isOptional (flags?: ts.SymbolFlags): flags is ts.SymbolFlags.Optional {
  return SymbolFlags.includes((flags || -1) - ts.SymbolFlags.Optional)
}
