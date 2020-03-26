import * as path from "path"
import { spawn } from "child_process"
import * as ts from "typescript"
import compile, { DocEntry, envMap } from "./parser"
import writeFile from "./write"
import { childrenMerge, splicing, parseLineFeed, isShowMembers, isShowAPI, isNotAPI, isFunction, isOptional } from "./parser/utils"

const taro_apis: (string | undefined)[] = []

type TCallback = (routepath: string, doc: DocEntry[], withGeneral?: boolean) => void

const TaroMethod = [
  ts.SymbolFlags.Function,
  ts.SymbolFlags.Class,
  ts.SymbolFlags.ValueModule,
  ts.SymbolFlags.Function + ts.SymbolFlags.NamespaceModule,
  ts.SymbolFlags.Namespace,
  ts.SymbolFlags.Method,
]
const isntTaroMethod = [
  -1,
  ts.SymbolFlags.BlockScopedVariable,
  ts.SymbolFlags.Interface,
  ts.SymbolFlags.ConstEnum,
  ts.SymbolFlags.RegularEnum,
  ts.SymbolFlags.ValueModule + ts.SymbolFlags.Interface,
  ts.SymbolFlags.ValueModule + ts.SymbolFlags.Class,
  ts.SymbolFlags.NamespaceModule,
  ts.SymbolFlags.NamespaceModule + ts.SymbolFlags.Class,
  ts.SymbolFlags.NamespaceModule + ts.SymbolFlags.Interface,
  ts.SymbolFlags.TypeLiteral,
  ts.SymbolFlags.TypeAlias,
]
const descTags = [
  'name', 'type', 'default', 'supported', 'abnormal', 'reason', 'solution', 'codeRate', 'remarks', 'readonly', 'ignore'
]
const isntShowType = [
  'any', 'InterfaceDeclaration',
]
const needLessDeclarationsName = [
  '__@unscopables', '__@iterator',
  ...Object.values(ts.InternalSymbolName)
]
const generalParh = path.resolve(__dirname, '../packages/taro', 'types/api/index.d.ts')

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
  members: (data?: DocEntry[], title = '方法', level: number = 2, name = 'Taro', isComp = false) => {
    if (!data) return undefined
    const methods: (string | undefined)[] = [level === 2 ? `## ${title}\n` : undefined]
    const paramTabs: DocEntry[] = []
    for (const v of data) {
      v.name !== ts.InternalSymbolName.Call &&
      v.flags !== ts.SymbolFlags.TypeParameter &&
      !isShowMembers(v.flags) && (v.jsTags || []).every(tag => tag.name !== 'ignore') && paramTabs.push(v)
    }

    if (paramTabs.length > 0) {
      const hasName = paramTabs.some(v => !!v.name)
      const hasType = paramTabs.some(v => !!v.type && !isntShowType.includes(v.type) || (v.name !== 'default' && needLessDeclarationsName.includes(v.name || '')))
      const hasDef = paramTabs.some(v => !!v.jsTags && v.jsTags.some(vv => vv.name === 'default'))
      const hasReadonly = paramTabs.some(v => !!v.jsTags && v.jsTags.some(vv => vv.name === 'readonly'))
      const hasOptional = paramTabs.some(v => isOptional(v.flags))
      const hasAbnormal = paramTabs.some(v => !!v.jsTags && v.jsTags.some(vv => vv.name === 'abnormal'))
      const hasReason = paramTabs.some(v => !!v.jsTags && v.jsTags.some(vv => vv.name === 'reason'))
      const hasSolution = paramTabs.some(v => !!v.jsTags && v.jsTags.some(vv => vv.name === 'solution'))
      const hasDes = paramTabs.some(v => !!v.documentation)
      const hasCodeRate = paramTabs.some(v => !!v.jsTags && v.jsTags.some(vv => vv.name === 'codeRate'))
      const hasRemarks = paramTabs.some(v => !!v.jsTags && v.jsTags.some(vv => vv.name === 'remarks'))

      hasName && [hasType, hasDef, hasAbnormal, hasReason, hasSolution, hasDes, hasCodeRate].reduce((s, b) => {
        b && s++
        return s
      }, 0) > 0 && methods.push(splicing([
        `| ${hasName ? '参数 |' : ''}${hasType? ' 类型 |' :''}${hasDef? ' 默认值 |' :''}${hasReadonly? ' 只读 |' :''}${hasOptional? ' 必填 |' :''}${hasAbnormal? ' 异常情况 |' :''}${hasReason? ' 理由 |' :''}${hasSolution? ' 解决方案 |' :''}${hasDes? ' 说明 |' :''}${hasCodeRate? ' 编码码率 |' :''}${hasRemarks? ' 备注 |' :''}`,
        `|${hasName? ' --- |' :''}${hasType? ' --- |' :''}${hasDef? ' :---: |' :''}${hasReadonly? ' :---: |' :''}${hasOptional? ' :---: |' :''}${hasAbnormal? ' :---: |' :''}${hasReason? ' :---: |' :''}${hasSolution? ' :---: |' :''}${hasDes? ' --- |' :''}${hasCodeRate? ' --- |' :''}${hasRemarks? ' --- |' :''}`,
        ...paramTabs.map(v => {
          let name = v.name || ''
          let type = v.type || ''
          const isMethod = TaroMethod.includes(v.flags || -1)
          const vtags = v.jsTags || [];
          const def = vtags.find(tag => tag.name === 'default') || { text: '' }
          const readonly = vtags.find(tag => tag.name === 'readonly')
          const abnormal = vtags.find(tag => tag.name === 'abnormal') || { text: '' }
          const reason = vtags.find(tag => tag.name === 'reason') || { text: '' }
          const solution = vtags.find(tag => tag.name === 'solution') || { text: '' }
          const codeRate = vtags.find(tag => tag.name === 'codeRate') || { text: '' }
          const remarks = vtags.find(tag => tag.name === 'remarks') || { text: '' }
          if (needLessDeclarationsName.includes(name)) {
            const tag_name = vtags.find(tag => tag.name === 'name') || { text: '' }
            const tag_type = vtags.find(tag => tag.name === 'type') || { text: '' }
            if (vtags.find(tag => tag.name === 'ignore')) return undefined
            name = tag_name.text || name
            type = tag_type.text ? tag_type.text.trim() : type === 'any' && v.name || ''
          }
          return `| ${name} |${
            hasType? ` ${parseLineFeed(type, true)} |` :''
          }${
            hasDef? ` ${parseLineFeed(def.text, true)} |` :''
          }${
            hasReadonly? ` ${readonly ? '是' : '否'} |` :''
          }${
            hasOptional? ` ${!isOptional(v.flags) ? '是' : '否'} |` :''
          }${
            hasAbnormal? ` ${parseLineFeed(abnormal.text, true)} |` :''
          }${
            hasReason? ` ${parseLineFeed(reason.text, true)} |` :''
          }${
            hasSolution? ` ${parseLineFeed(solution.text, true)} |` :''
          }${
            hasDes? ` ${
              parseLineFeed(v.documentation)
            }${
              vtags.length > 0 ? `${vtags
                .filter(arrs => !descTags.includes(arrs.name) || !isMethod && arrs.name === 'supported')
                .map(arrs => {
                  if (arrs.name === 'see') {
                    return `<br />[参考地址](${arrs.text})`
                  } else if (arrs.name === 'supported') {
                    if (!isComp) return `<br />API 支持度: ${arrs.text}`
                  } else if (arrs.name === 'deprecated') {
                    return arrs.text ? `<br />不推荐: ${arrs.text}` : '<br />**不推荐使用**'
                  } else {
                    if (!isComp || !Object.values(envMap).find(env => env.name === arrs.name)) {
                      return `<br />${arrs.name}: ${parseLineFeed(arrs.text)}`
                    }
                  }
                }).join('')
            }` : ''
          } |` :''
        }${
            hasCodeRate? ` ${parseLineFeed(codeRate.text, true)} |` :''
          }${
            hasRemarks? ` ${parseLineFeed(remarks.text, true)} |` :''
          }`
        }),
      '']))
    }
    const componentApis = {}
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
        if (param.declarations) {
          for (const decla of param.declarations) {
            for (const key in decla) {
              if (decla.hasOwnProperty(key) && decla[key]) {
                if (!declaration[key] || declaration[key].length < decla[key].length) {
                  declaration[key] = decla[key]
                }
              }
            }
          }
        }

        if (!isFunction(param.flags) && !TaroMethod.includes(param.flags || -1) && !isntTaroMethod.includes(param.flags || -1)) {
          console.warn(`WARN: Symbol flags ${param.flags} is missing parse! Watch symbol name:${param.name}.`)
        }

        const members = param.members || []
        const apis = { [`${TaroMethod.includes(param.flags || -1) ? `${name}.` : ''}${param.name}`]: tags }
        for (const member of members) {
          if (isShowAPI(member.flags)) {
            if (member.name && member.jsTags) apis[`${param.name}.${member.name}`] = member.jsTags || []
          } else if (!isNotAPI(member.flags)) {
            console.warn(`WARN: Symbol flags ${member.flags} for members is missing parse! Watch member name:${member.name}.`)
          }
        }

        return splicing([
          `${'#'.repeat(level === 2 ? level + 1 : level)} ${param.name}\n`,
          get.since(tags.find(tag => tag.name === 'since')),
          get.document(param.documentation),
          get.see(tags.find(tag => tag.name === 'see')),
          get.type(param.type),
          get.members(param.members, undefined, level + (level === 2 ? 2 : 1), param.name, isComp),
          get.members(declaration.parameters || param.exports, '参数', level + (level === 2 ? 2 : 1), param.name, isComp),
          get.example(tags, level + (level === 2 ? 2 : 1)),
          get.api(apis, level + (level === 2 ? 2 : 1)),
        ])
      } else if (isComp && isShowAPI(param.flags)) {
        if (param.name && param.jsTags) componentApis[`${name}.${param.name}`] = param.jsTags || []
      } /*  else if (!isShowAPI(param.flags) && !isNotAPI(param.flags) && param.flags !== 1) {
        console.log(param.name, param.flags)
      } */
    }))
    isComp && methods.push(get.api(componentApis, level))

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
  api: (data: {[name: string]: ts.JSDocTagInfo[]}, level: number = 2) => {
    const hasSupporteds = [true, undefined, undefined, undefined, undefined, undefined, true, true, undefined]
    for (const name of Object.keys(data)) {
      const tags = data[name]
      const supported = tags.find(tag => tag.name === 'supported')
      const apis = (supported && supported.text || '').split(',').map(e => e.trim().toLowerCase())

      for (let i = 0; i < envMap.length; i++) {
        if (hasSupporteds[i]) continue
        const apiDesc = tags.find(e => e.name === envMap[i].name)
        const hasSupported = !!(apiDesc && apiDesc.text || apis.find(e => e === envMap[i].name))
        if (!hasSupporteds[i] && hasSupported) hasSupporteds[i] = true
      }
    }
    const rows = Object.keys(data).map(name => {
      const tags = data[name]
      const supported = tags.find(tag => tag.name === 'supported')
      const apis = (supported && supported.text || '').split(',').map(e => e.trim().toLowerCase())

      return supported ? `| ${name} |${envMap.map((env, i) => {
        if (!hasSupporteds[i]) return undefined
        const apiDesc = tags.find(e => e.name === env.name)
        return ` ${
          apis.find(e => e === env.name) ? '✔️': ''
        }${apiDesc && apiDesc.text ? `(${apiDesc.text})` : ''} |`
      }).join('')}` : undefined
    })

    taro_apis.push(...rows.filter(e => !!e))
    const titles = envMap.reduce((p, env, i) => hasSupporteds[i] ? `${p} ${env.label} |` : p, '| API |')
    const splits = envMap.reduce((p, _env, i) => hasSupporteds[i] ? `${p} :---: |` : p, '| :---: |')

    return rows && rows.filter(e => !!e).length > 0 ? splicing([
      `${'#'.repeat(level)} API 支持度\n`, titles, splits, ...rows, ''
    ]) : undefined // splicing(['## API 支持度', '', '> 该 api 暂不支持', ''])
  },
  see: (data?: ts.JSDocTagInfo) => data ? splicing([`> [参考文档](${data.text || ''})`, '']) : undefined
}

export default function docsAPI (
  base: string = '.',
  out: string,
  files: string[],
  callback: TCallback = () => {},
  withLog = true,
  diff = true,
) {
  const cwd: string = process.cwd();

  if (diff) {
    const canges = spawn('git', ['status', '-z'])
  
    canges.stdout.on('data', (data) => {
      const ss = data.toString().trim().split(/\u0000|\s+/ig)
      for (const s of ss) {
        const route = path.resolve(cwd, s)
        const output = route
          .replace(path.resolve(cwd, base), path.resolve(cwd, out))
          .replace(/(\.[a-z]+)$|(\.d\.ts)$/ig, '')
        for (const e of files) {
          const pe = path.resolve(cwd, e)
          if (route.indexOf(pe) > -1) {
            compile(cwd, s, [generalParh], async (route, doc) => {
              withLog && console.log(route)
              if (doc.length < 1) return
              await callback(output, doc, route === generalParh)
            })
          }
        }
      }
    })
    canges.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`)
    })
  } else {
    for (const s of files) {
      compile(cwd, s, [generalParh], async (route, doc) => {
        const output = route
          .replace(path.resolve(cwd, base), path.resolve(cwd, out))
          .replace(/(\.[a-z]+)$|\.d\.ts$/ig, '')
        withLog && console.log(route)
        if (doc.length < 1) return
        await callback(output, doc, route === generalParh)
      })
    }
  }
}

export async function writeJson (routepath: string, doc: DocEntry[]) {
  const merge = await childrenMerge(doc, [])
  const Taro = merge.find(e => e.name === 'Taro')

  writeFile(`${routepath}.json`, JSON.stringify(Taro, undefined, 2))
}

export async function writeApiDoc (routepath: string, doc: DocEntry[], withGeneral = false) {
  const _p = path.parse(routepath)
  const merge = await childrenMerge(doc, [])
  const Taro = merge.find(e => e.name === 'Taro')

  if (Taro) {
    for (const e of Taro.exports || []) {
      const name = e.name || 'undefined'
      const tags = e.jsTags || []
      const params = e.parameters || []
      const members = e.members || []
      const md: (string | undefined)[] = []
  
      if (name === 'General' && !withGeneral) continue
      if (tags.find(tag => tag.name === 'ignore')) continue
  
      if (!isFunction(e.flags) && !TaroMethod.includes(e.flags || -1) && !isntTaroMethod.includes(e.flags || -1)) {
        console.warn(`WARN: Symbol flags ${e.flags} is missing parse! Watch symbol name:${name}.`)
      }
  
      const apis = { [`${TaroMethod.includes(e.flags || -1) ? 'Taro.' : ''}${name}`]: tags }
  
      for (const member of members) {
        if (isShowAPI(member.flags)) {
          if (member.name && member.jsTags) apis[`${name}.${member.name}`] = member.jsTags || []
        } else if (!isNotAPI(member.flags)) {
          console.warn(`WARN: Symbol flags ${member.flags} for members is missing parse! Watch member name:${member.name}.`)
        }
      }
  
      md.push(
        get.header({ title: get.title(name, params, e.flags), sidebar_label: name }),
        get.since(tags.find(tag => tag.name === 'since')),
        get.document(e.documentation),
        get.see(tags.find(tag => tag.name === 'see')),
        get.type(e.type, 2),
        get.members(e.members, undefined, 2, TaroMethod.includes(e.flags || -1) ? 'Taro' : name),
        get.members(e.exports || e.parameters, '参数', 2, TaroMethod.includes(e.flags || -1) ? 'Taro' : name),
        get.example(tags),
        get.api(apis),
      )
  
      writeFile(
        path.resolve(_p.name === 'index' ? _p.dir : routepath, `${name}.md`),
        splicing(md),
      )
    }
  }
}

export async function writeDoc (routepath: string, doc: DocEntry[]) {
  const isComp = true
  const _p = path.parse(routepath)
  const merge = await childrenMerge(doc, [])
  const Component = merge.find(e => e.name === _p.name) || {}
  const ComponentTags = Component.jsTags || []
    
  const apis = { [`${_p.name}`]: ComponentTags }

  for (const member of Component && (Component.members || [])) {
    if (isShowAPI(member.flags)) {
      if (member.name && member.jsTags) apis[`${_p.name}.${member.name}`] = member.jsTags || []
    } else if (!isNotAPI(member.flags)) {
      console.warn(`WARN: Symbol flags ${member.flags} for members is missing parse! Watch member name:${member.name}.`)
    }
  }

  const name = (_p.name && _p.name.split(/(?<!^)(?=[A-Z])/).join('-') || 'undefined').toLocaleLowerCase()
  const classification = ComponentTags.find(tag => tag.name === 'classification') || { text: '' }

  ComponentTags.every(tag => tag.name !== 'ignore') && writeFile(
    path.resolve(_p.dir, classification.text || '', `${name}.md`),
    splicing([
      get.header({ title: _p.name, sidebar_label: _p.name }),
      get.since(ComponentTags.find(tag => tag.name === 'since')),
      get.document(Component.documentation),
      get.see(ComponentTags.find(tag => tag.name === 'see')),
      get.type(Component.type, 2),
      get.members(Component.members, undefined, 2, name, isComp),
      get.members(Component.exports || Component.parameters, '参数', 2, name, isComp),
      get.example(ComponentTags),
      ...merge.map(e => {
        const name = e.name || 'undefined'
        if (name === _p.name) return undefined
        const tags = e.jsTags || []
        const md: (string | undefined)[] = []

        if (e.flags === ts.SymbolFlags.TypeLiteral) return undefined
        if (tags.find(tag => tag.name === 'ignore')) return undefined
    
        if (!isFunction(e.flags) && !TaroMethod.includes(e.flags || -1) && !isntTaroMethod.includes(e.flags || -1)) {
          console.warn(`WARN: Symbol flags ${e.flags} is missing parse! Watch symbol name:${name}.`)
        }
    
        md.push(
          `## ${name}\n`,
          get.since(tags.find(tag => tag.name === 'since')),
          get.document(e.documentation),
          get.see(tags.find(tag => tag.name === 'see')),
          get.type(e.type, 3),
          get.members(e.members, undefined, 3, name, isComp),
          get.members(e.exports || e.parameters, '参数', 3, name, isComp),
          get.example(tags, 3),
        )

        return splicing(md)
      }),
      get.api(apis),
    ]),
  )
}

function main() {
  // docsAPI('packages/taro/types/api', 'docs/apis', ['packages/taro/types/api'], writeJson)
  // docsAPI('packages/taro/types/api', 'docs/apis', ['packages/taro/types/api'], writeApiDoc)
   docsAPI('packages/taro/types/api', 'docs/apis', ['packages/taro/types/api'], writeApiDoc,
    process.argv.findIndex(e => /^[-]{2}verbose/ig.test(e)) > -1,
    process.argv.findIndex(e => /^[-]{2}force/ig.test(e)) === -1)
  // docsAPI('packages/taro-components/types', 'docs/components', ['packages/taro-components/types'], writeJson,
  //   process.argv.findIndex(e => /^[-]{2}verbose/ig.test(e)) > -1,
  //   process.argv.findIndex(e => /^[-]{2}force/ig.test(e)) === -1)
  docsAPI('packages/taro-components/types', 'docs/components', ['packages/taro-components/types'], writeDoc,
    process.argv.findIndex(e => /^[-]{2}verbose/ig.test(e)) > -1,
    process.argv.findIndex(e => /^[-]{2}force/ig.test(e)) === -1)
  
  // writeFile(
  //   path.resolve(__dirname, `taro-apis.md`),
  //   splicing([
  //     envMap.reduce((p, env) => `${p} ${env.label} |`, '| API |'),
  //     envMap.reduce((p) => `${p} :---: |`, '| :---: |'),
  //     ...taro_apis, ''
  //   ]),
  // )
}

main()