import * as path from "path"
import * as ts from "typescript"
import compile, { DocEntry, envMap } from "./parser"
import writeFile from "./write"

type TCallback = (routepath: string, doc: DocEntry[], withGeneral?: boolean) => void

const SymbolFlags = Object.values(ts.SymbolFlags)
const InternalSymbolName = Object.values(ts.InternalSymbolName)
const TaroMethod = [
  ts.SymbolFlags.Function,
  ts.SymbolFlags.Class,
  ts.SymbolFlags.ValueModule,
  ts.SymbolFlags.Function + ts.SymbolFlags.NamespaceModule,
  ts.SymbolFlags.Namespace,
]
const isntTaroMethod = [
  -1,
  ts.SymbolFlags.Interface,
  ts.SymbolFlags.ConstEnum,
  ts.SymbolFlags.RegularEnum,
  ts.SymbolFlags.ValueModule + ts.SymbolFlags.Class,
  ts.SymbolFlags.NamespaceModule,
  ts.SymbolFlags.NamespaceModule + ts.SymbolFlags.Class,
  ts.SymbolFlags.NamespaceModule + ts.SymbolFlags.Interface,
  ts.SymbolFlags.TypeLiteral,
  ts.SymbolFlags.TypeAlias,
]
const descTags = [
  'name', 'type', 'default', 'supported', 'abnormal', 'reason', 'solution',
]
const isntShowType = [
  'any', 'InterfaceDeclaration',
]
const needLessDeclarationsName = [
  '__@unscopables', '__@iterator',
  ...InternalSymbolName
]
const generalParh = path.resolve(__dirname, '../', 'types/api/index.d.ts')

export default function docsAPI (
  base: string = '.',
  out: string,
  files: string[],
  callback: TCallback = () => {},
  withLog = false,
) {
  const cwd: string = process.cwd();
  files.forEach(s => {
    compile(cwd, s, [generalParh], (route, doc) => {
      const output = route
        .replace(path.resolve(cwd, base), path.resolve(cwd, out))
        .replace(/(.[a-z]+)$|(.d.ts)$/ig, '')
      withLog && console.log(route)
      if (doc.length < 1) return
      callback(output, doc, route === generalParh)
    })
  })
}

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

export function writeJson (routepath: string, doc: DocEntry[]) {
  const Taro = childrenMerge(doc, []).find(e => e.name === 'Taro')

  writeFile(`${routepath}.json`, JSON.stringify(Taro, undefined, 2))
}

const get = {
  header: (data: {
    title: string
    sidebar_label: string
    [key: string]: string
  }) => splicing(['---', ...Object.keys(data).map(key => `${key}: ${data[key]}`), '---', '']),
  title: (name: string, params: DocEntry[], flags: number = -1) => `${
    TaroMethod.includes(flags) ? 'Taro.' : ''
  }${name}${
    isFunction(flags) ? `(${params.map(param => param.name).join(', ')})` : ''
  }`,
  document: (data?: string) => data ? splicing([data, '']) : undefined,
  since: (data?: ts.JSDocTagInfo) => data ? splicing([`> 最低 Taro 版本: ${data.text || ''}`, '']) : undefined,
  type: (data?: string, level = 0) => data && !isntShowType.includes(data) ?
    splicing([level !== 0 ? `${'#'.repeat(level)} 类型\n` : undefined, '```tsx', data, '```', '']) : undefined,
  members: (data?: DocEntry[], title = '方法', level: number = 2) => {
    if (!data) return undefined
    const methods: (string | undefined)[] = [level === 2 ? `## ${title}\n` : undefined]
    const paramTabs: DocEntry[] = []
    data.forEach(v => {
      v.name !== ts.InternalSymbolName.Call &&
      v.flags !== ts.SymbolFlags.TypeParameter &&
      !isShowMembers(v.flags) &&
      paramTabs.push(v)
    })

    if (paramTabs.length > 0) {
      const hasName = paramTabs.some(v => !!v.name)
      const hasType = paramTabs.some(v => !!v.type && !isntShowType.includes(v.type) || needLessDeclarationsName.includes(v.name || ''))
      const hasDef = paramTabs.some(v => !!v.jsTags && v.jsTags.some(vv => vv.name === 'default'))
      const hasOptional = paramTabs.some(v => isOptional(v.flags))
      const hasAbnormal = paramTabs.some(v => !!v.jsTags && v.jsTags.some(vv => vv.name === 'abnormal'))
      const hasReason = paramTabs.some(v => !!v.jsTags && v.jsTags.some(vv => vv.name === 'reason'))
      const hasSolution = paramTabs.some(v => !!v.jsTags && v.jsTags.some(vv => vv.name === 'solution'))
      const hasDes = paramTabs.some(v => !!v.documentation)

      hasName && [hasType, hasDef, hasAbnormal, hasReason, hasSolution, hasDes].reduce((s, b) => {
        b && s++
        return s
      }, 0) > 0 && methods.push(splicing([
        `| ${hasName ? '参数 |' : ''}${hasType? ' 类型 |' :''}${hasDef? ' 默认值 |' :''}${hasOptional? ' 必填 |' :''}${hasAbnormal? ' 异常情况 |' :''}${hasReason? ' 理由 |' :''}${hasSolution? ' 解决方案 |' :''}${hasDes? ' 说明 |' :''}`,
        `|${hasName? ' --- |' :''}${hasType? ' --- |' :''}${hasDef? ' :---: |' :''}${hasOptional? ' :---: |' :''}${hasAbnormal? ' :---: |' :''}${hasReason? ' :---: |' :''}${hasSolution? ' :---: |' :''}${hasDes? ' --- |' :''}`,
        ...paramTabs.map(v => {
          let name = v.name || ''
          let type = v.type || ''
          const isMethod = TaroMethod.includes(v.flags || -1)
          const vtags = v.jsTags || [];
          const def = vtags.find(tag => tag.name === 'default') || { text: '' }
          const abnormal = vtags.find(tag => tag.name === 'abnormal') || { text: '' }
          const reason = vtags.find(tag => tag.name === 'reason') || { text: '' }
          const solution = vtags.find(tag => tag.name === 'solution') || { text: '' }
          if (needLessDeclarationsName.includes(name)) {
            const tag_name = vtags.find(tag => tag.name === 'name') || { text: '' }
            const tag_type = vtags.find(tag => tag.name === 'type') || { text: '' }
            name = tag_name.text || name
            type = tag_type.text ? tag_type.text.trim() : type === 'any' && v.name || ''
          }
          return `| ${name} |${
            hasType? ` ${type ? `\`${type}\`` : ''} |` :''}${
            hasDef? ` ${def.text ? `\`${def.text}\`` : ''} |` :''}${
            hasOptional? ` ${!isOptional(v.flags) ? '是' : '否'} |` :''}${
            hasAbnormal? ` ${abnormal.text ? `\`${abnormal.text}\`` : ''} |` :''}${
            hasReason? ` ${reason.text ? `\`${reason.text}\`` : ''} |` :''}${
            hasSolution? ` ${solution.text ? `\`${solution.text}\`` : ''} |` :''}${
            hasDes? ` ${parseLineFeed(v.documentation)}${
              vtags.length > 0 ? `${vtags
                .filter(arrs => !descTags.includes(arrs.name) || !isMethod && arrs.name === 'supported')
                .map(arrs => {
                  if (arrs.name === 'see') {
                    return `<br />[参考地址](${arrs.text})`
                  } else if (arrs.name === 'supported') {
                    return `<br />API 支持度: ${arrs.text}`
                  } else {
                    return `<br />${arrs.name}: ${parseLineFeed(arrs.text)}`
                  }
                }).join('')
            }` : ''
          } |` :''}`
        }),
      '']))
    }
    methods.push(...data.map(param => {
      const tags = param.jsTags || []

      if (param.name === ts.InternalSymbolName.Call) {
        const declarations = param.declarations || []
        const call_decla = declarations[0] || {}
        return splicing([
          '```tsx',
          `(${(call_decla.parameters || [])
            .map(call_params => `${call_params.name}: ${call_params.type}`)
            .join(',')}) => ${call_decla.returnType}`,
          '```',
          '',
        ])
      }
      if (isShowMembers(param.flags) && !needLessDeclarationsName.includes(param.name || '')) {
        const declaration: DocEntry = {}
        param.declarations && param.declarations.forEach(decla => {
          for (const key in decla) {
            if (decla.hasOwnProperty(key) && decla[key]) {
              if (!declaration[key] || declaration[key].length < decla[key].length) {
                declaration[key] = decla[key]
              }
            }
          }
        })
        return splicing([
          `${'#'.repeat(level === 2 ? level + 1 : level)} ${param.name}\n`,
          get.document(param.documentation),
          get.since(tags.find(tag => tag.name === 'since')),
          get.type(param.type),
          get.members(param.members, '方法', level + (level === 2 ? 2 : 1)),
          get.members(declaration.parameters, '参数', level + (level === 2 ? 2 : 1)),
          get.example(tags, level + (level === 2 ? 2 : 1)),
          get.see(tags.find(tag => tag.name === 'see')),
        ])
      }/*  else if (!isShowAPI(param.flags) && !isNotAPI(param.flags) && param.flags !== 1) {
        console.log(param.name, param.flags)
      } */
    }))

    return splicing(methods) || undefined
  },
  example: (tags: ts.JSDocTagInfo[], level: number = 2) => {
    const array: string[] = []
    let exampleIdx = tags.findIndex(tag => tag.name === 'example')
    let exampleNum = 0
    do {
      const example = tags[exampleIdx]
      if (example) {
        exampleNum === 0 && array.push(`${'#'.repeat(level)} 示例代码\n`)
        exampleNum++
        if ((exampleIdx = tags.findIndex((tag, i) => exampleIdx < i && tag.name === 'example')) > -1 || exampleNum > 1) {
          array.push(`${'#'.repeat(level + 1)} 示例 ${exampleNum}\n`)
        }
        array.push((example.text || '').split('\\`@').join('@'), '')
      }
    } while (exampleIdx > -1)

    return array.length > 0 ? splicing(array) : undefined
  },
  api: (data: {[name: string]: ts.JSDocTagInfo[]}) => {
    const titles = envMap.reduce((p, env) => `${p} ${env.label} |`, '| API |')
    const splits = envMap.reduce((p) => `${p} :---: |`, '| :---: |')
    const rows = Object.keys(data).map(name => {
      const tags = data[name]
      const supported = tags.find(tag => tag.name === 'supported')
      const apis = (supported && supported.text || '').split(',').map(e => e.trim().toLowerCase())

      return supported ? `| ${name} |${envMap.map(env => {
        const apiName = apis.find(e => e === env.name)
        const apiDesc = tags.find(e => e.name === apiName)
        return ` ${apiName ? '✔️': ''}${apiDesc && apiDesc.text ? `(${apiDesc.text})` : ''} |`
      }).join('')}` : undefined
    })

    return rows && rows.filter(e => !!e).length > 0 ? splicing([
      '## API 支持度', '', titles, splits, ...rows, ''
    ]) : undefined // splicing(['## API 支持度', '', '> 该 api 暂不支持', ''])
  },
  see: (data?: ts.JSDocTagInfo) => data ? splicing([`> [参考文档](${data.text || ''})`, '']) : undefined
}

export function writeDoc (routepath: string, doc: DocEntry[], withGeneral = false) {
  const _p = path.parse(routepath)
  const Taro = childrenMerge(doc, []).find(e => e.name === 'Taro')

  Taro && (Taro.exports || []).forEach(e => {
    const name = e.name || 'undefined'
    const tags = e.jsTags || []
    const params = e.parameters || []
    const members = e.members || []
    const md: (string | undefined)[] = []

    if (name === 'General' && !withGeneral) {
      return
    }

    if (!isFunction(e.flags) && !TaroMethod.includes(e.flags || -1) && !isntTaroMethod.includes(e.flags || -1)) {
      console.warn(`WARN: Symbol flags ${e.flags} is missing parse! Watch symbol name:${name}.`)
    }

    const apis = { [`${TaroMethod.includes(e.flags || -1) ? 'Taro.' : ''}${name}`]: tags }

    members.forEach(member => {
      if (isShowAPI(member.flags)) {
        if (member.name && member.jsTags) apis[`${name}.${member.name}`] = member.jsTags || []
      } else if (!isNotAPI(member.flags)) {
        console.warn(`WARN: Symbol flags ${member.flags} for members is missing parse! Watch member name:${member.name}.`)
      }
    })

    md.push(
      get.header({ title: get.title(name, params, e.flags), sidebar_label: name }),
      get.document(e.documentation),
      get.since(tags.find(tag => tag.name === 'since')),
      get.type(e.type, 2),
      get.members(e.members),
      get.members(e.exports || e.parameters, '参数', 2),
      get.example(tags),
      get.api(apis),
      get.see(tags.find(tag => tag.name === 'see')),
    )

    writeFile(
      path.resolve(_p.name === 'index' ? _p.dir : routepath, `${name}.md`),
      splicing(md),
    )
  })
}

// docsAPI('./types/api', './apis', ['./types/api'], writeJson)
// docsAPI('./types/api', './apis', ['./types/api'], writeDoc)
docsAPI('./types/api', '../../docs/apis', ['./types/api'], writeDoc)

function splicing (arr: (string | undefined)[] = []) {
  return arr.filter(e => typeof e === 'string').join('\n')
}

function parseLineFeed (s?: string) {
  return (s || '').split('\n').join('<br />')
}

function isShowMembers (flags?: ts.SymbolFlags, used: ts.SymbolFlags[] = []) {
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

function isShowAPI (flags?: ts.SymbolFlags) {
  return [
    ts.SymbolFlags.Property,
    ts.SymbolFlags.Method,
    ts.SymbolFlags.Optional + ts.SymbolFlags.Property,
    ts.SymbolFlags.Optional + ts.SymbolFlags.Method,
  ].includes(flags || -1)
}

function isNotAPI (flags?: ts.SymbolFlags) {
  return [
    -1,
    ts.SymbolFlags.Signature,
    ts.SymbolFlags.TypeParameter,
  ].includes(flags || -1)
}

function isFunction (flags?: ts.SymbolFlags) {
  return SymbolFlags.includes((flags || -1) - ts.SymbolFlags.Function)
}

function isOptional (flags?: ts.SymbolFlags) {
  return SymbolFlags.includes((flags || -1) - ts.SymbolFlags.Optional)
}