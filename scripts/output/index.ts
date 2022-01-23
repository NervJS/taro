import * as path from 'path'
import { spawn } from 'child_process'
import * as ts from 'typescript'
import compile, { DocEntry, envMap } from '../parser'
import { splicing, parseLineFeed, isShowMembers, isShowAPI, isNotAPI, isFunction, isOptional } from '../parser/utils'

export const taro_apis: (string | undefined)[] = []

type TCallback = (routePath: string, doc: DocEntry[], withGeneral?: boolean) => void

export const TaroMethod = [
  ts.SymbolFlags.Function,
  ts.SymbolFlags.Class,
  ts.SymbolFlags.ValueModule,
  ts.SymbolFlags.Function + ts.SymbolFlags.NamespaceModule,
  ts.SymbolFlags.Namespace,
  ts.SymbolFlags.Method,
]
export const isntTaroMethod = [
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
export const descTags = [
  'name', 'type', 'default', 'supported', 'abnormal', 'reason', 'solution', 'codeRate', 'remarks', 'readonly', 'ignore'
]
export const isntShowType = [
  'any', 'InterfaceDeclaration',
]
export const needLessDeclarationsName = [
  '__@unscopables', '__@iterator',
  ...Object.values(ts.InternalSymbolName)
]
export const generalPath = path.resolve(__dirname, '../../packages/taro', 'types/api/index.d.ts')

export const get = {
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
  since: (data?: ts.JSDocTagInfo) => data ? splicing([`> 最低 Taro 版本: ${data.text?.map(e => e.text).join('') || ''}`, '']) : undefined,
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
          const vTags = v.jsTags || [];
          const def = vTags.find(tag => tag.name === 'default')?.text?.map(e => e.text).join('') || ''
          const readonly = vTags.find(tag => tag.name === 'readonly')
          const abnormal = vTags.find(tag => tag.name === 'abnormal')?.text?.map(e => e.text).join('') || ''
          const reason = vTags.find(tag => tag.name === 'reason')?.text?.map(e => e.text).join('') || ''
          const solution = vTags.find(tag => tag.name === 'solution')?.text?.map(e => e.text).join('') || ''
          const codeRate = vTags.find(tag => tag.name === 'codeRate')?.text?.map(e => e.text).join('') || ''
          const remarks = vTags.find(tag => tag.name === 'remarks')?.text?.map(e => e.text).join('') || ''
          if (needLessDeclarationsName.includes(name)) {
            const tag_name = vTags.find(tag => tag.name === 'name')?.text?.map(e => e.text).join('') || ''
            const tag_type = vTags.find(tag => tag.name === 'type')?.text?.map(e => e.text).join('') || ''
            if (vTags.find(tag => tag.name === 'ignore')) return undefined
            name = tag_name || name
            type = tag_type ? tag_type.trim() : type === 'any' && v.name || ''
          }
          return `| ${name} |${
            hasType? ` ${parseLineFeed(type, true)} |` :''
          }${
            hasDef? ` ${parseLineFeed(def, true)} |` :''
          }${
            hasReadonly? ` ${readonly ? '是' : '否'} |` :''
          }${
            hasOptional? ` ${!isOptional(v.flags) ? '是' : '否'} |` :''
          }${
            hasAbnormal? ` ${parseLineFeed(abnormal, true)} |` :''
          }${
            hasReason? ` ${parseLineFeed(reason, true)} |` :''
          }${
            hasSolution? ` ${parseLineFeed(solution, true)} |` :''
          }${
            hasDes? ` ${
              parseLineFeed(v.documentation)
            }${
              vTags.length > 0 ? `${vTags
                .filter(arrs => !descTags.includes(arrs.name) || !isMethod && arrs.name === 'supported')
                .map(arrs => {
                  const name = arrs.name
                  const text = arrs?.text?.map(e => e.text).join('') || ''
                  if (name === 'see') {
                    return `<br />[参考地址](${text})`
                  } else if (name === 'supported') {
                    if (!isComp) return `<br />API 支持度: ${text}`
                  } else if (name === 'deprecated') {
                    return text ? `<br />不推荐: ${text}` : '<br />**不推荐使用**'
                  } else {
                    if (!isComp || !Object.values(envMap).find(env => env.name === name)) {
                      return `<br />${name}: ${parseLineFeed(text)}`
                    }
                  }
                }).join('')
            }` : ''
          } |` :''
        }${
            hasCodeRate? ` ${parseLineFeed(codeRate, true)} |` :''
          }${
            hasRemarks? ` ${parseLineFeed(remarks, true)} |` :''
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
    const tabs: string[] = []
    let hasTabs = false
    let defaultTab = ''
    let exampleIdx = tags.findIndex(tag => tag.name?.startsWith('example'))
    let exampleNum = 0
    while (exampleIdx > -1 && exampleNum < tags.length) {
      const tag = tags[exampleIdx]
      if (!tag || exampleIdx < 0) break
      const name = tag?.name?.replace(/example_([a-z])/, (__, $1) => $1.toUpperCase())
      if (!hasTabs && tag?.name !== 'example') {
        hasTabs = true
        defaultTab = name
      }
      const example = tag?.text?.map(e => e.text.replace(/`@/g, '@')).join('') || ''
      exampleNum++
      exampleIdx = tags.findIndex((tag, i) => exampleIdx < i && tag.name?.startsWith('example'))
      if (hasTabs) {
        tabs.push(name)
        array.push(`<TabItem value="${name}">\n`)
        array.push(example)
        array.push('</TabItem>')
      } else {
        if (exampleIdx > -1 || exampleNum > 1) {
          array.push(`${'#'.repeat(level + 1)} 示例 ${exampleNum}\n`)
        }
        array.push(example + '\n')
      }
    }
    if (hasTabs) {
      array.unshift(`import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

<Tabs
  defaultValue="${defaultTab}"
  values={${JSON.stringify(tabs.map(e => ({ label: e, value: e })), undefined, 2)}}>`)
      array.push('</Tabs>\n')
    }

    if (array.length > 0) array.unshift(`${'#'.repeat(level)} 示例代码\n`)

    return array.length > 0 ? splicing(array) : undefined
  },
  api: (data: {[name: string]: ts.JSDocTagInfo[]}, level: number = 2) => {
    const hasSupportedList = [true, undefined, undefined, undefined, undefined, undefined, true, true, undefined]
    for (const name of Object.keys(data)) {
      const tags = data[name]
      const supported = tags.find(tag => tag.name === 'supported')?.text?.map(e => e.text).join('') || ''
      const apis = supported.split(',').map(e => e.trim().toLowerCase())

      for (let i = 0; i < envMap.length; i++) {
        if (hasSupportedList[i]) continue
        const apiDesc = tags.find(e => e.name === envMap[i].name)?.text?.map(e => e.text).join('') || ''
        const hasSupported = !!(apiDesc || apis.find(e => e === envMap[i].name))
        if (!hasSupportedList[i] && hasSupported) hasSupportedList[i] = true
      }
    }
    const rows = Object.keys(data).map(name => {
      const tags = data[name]
      const supported = tags.find(tag => tag.name === 'supported')?.text?.map(e => e.text).join('') || ''
      const apis = supported.split(',').map(e => e.trim().toLowerCase())

      return supported ? `| ${name} |${envMap.map((env, i) => {
        if (!hasSupportedList[i]) return undefined
        const apiDesc = tags.find(e => e.name === env.name)?.text?.map(e => e.text).join('') || ''
        return ` ${
          apis.find(e => e === env.name) ? '✔️': ''
        }${apiDesc ? `(${apiDesc})` : ''} |`
      }).join('')}` : undefined
    })

    taro_apis.push(...rows.filter(e => !!e))
    const titles = envMap.reduce((p, env, i) => hasSupportedList[i] ? `${p} ${env.label} |` : p, '| API |')
    const splits = envMap.reduce((p, _env, i) => hasSupportedList[i] ? `${p} :---: |` : p, '| :---: |')

    return rows && rows.filter(e => !!e).length > 0 ? splicing([
      `${'#'.repeat(level)} API 支持度\n`, titles, splits, ...rows, ''
    ]) : undefined // splicing(['## API 支持度', '', '> 该 api 暂不支持', ''])
  },
  see: (data?: ts.JSDocTagInfo) => data ? splicing([`> [参考文档](${data.text?.map(e => e.text).join('') || ''})`, '']) : undefined
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
            compile(cwd, s, [generalPath], async (route, doc) => {
              withLog && console.log(route)
              if (doc.length < 1) return
              await callback(output, doc, route === generalPath)
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
      compile(cwd, s, [generalPath], async (route, doc) => {
        const output = route
          .replace(path.resolve(cwd, base), path.resolve(cwd, out))
          .replace(/(\.[a-z]+)$|\.d\.ts$/ig, '')
        withLog && console.log(route)
        if (doc.length < 1) return
        await callback(output, doc, route === generalPath)
      })
    }
  }
}

export { writeApiDoc } from './api'
export { writeDoc } from './components'
export { writeJson } from './json'
