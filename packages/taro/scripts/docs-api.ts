import * as path from "path"
import * as ts from "typescript"
import compile, { DocEntry, envMap } from "./parser"
import writeFile from "./write"

type TCallback = (routepath: string, doc: DocEntry[], withGeneral?: boolean) => void

const FunctionFlags = [16, 1040]
const isntTaroMethod = [-1, 1024, 1088]
const generalParh = path.resolve(__dirname, '../', 'types/api/index.d.ts')

export default function docsAPI (
  base: string = '.',
  out: string,
  files: string[],
  callback: TCallback = () => {},
  withLog = true,
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
          if (!target.flags || !FunctionFlags.includes(e.flags || -1)) target.flags = e.flags
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
        else Object.assign(kk, k)
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
    isntTaroMethod.includes(flags) ? '' : 'Taro.'
  }${name}${
    FunctionFlags.includes(flags) ? `(${params.map(param => param.name).join(', ')})` : ''
  }`,
  document: (data?: string) => data ? splicing([data, '']) : undefined,
  since: (data?: ts.JSDocTagInfo) => data ? splicing([`> 最低 Taro 版本: ${data.text || ''}`, '']) : undefined,
  type: (data?: string, level = 0) => data && data !== 'InterfaceDeclaration' ?
    splicing([level !== 0 ? `${'#'.repeat(level)} 类型\n` : undefined, '```tsx', data, '```', '']) : undefined,
  members: (data?: DocEntry[], level: number = 2) => {
    if (!data) return undefined
    const methods: string[] = []
    const paramLens = data && data.reduce((s, v) => v.name !== ts.InternalSymbolName.Call && ++s, 0)

    if (paramLens > 0) {
      const hasType = data.some(v => !!v.type)
      const hasDef = data.some(v => !!v.jsTags && v.jsTags.some(vv => vv.name === 'default'))
      const hasDes = data.some(v => !!v.documentation)

      methods.push(splicing([
        `| Name |${hasType? ' Type |' :''}${hasDef? ' Default |' :''}${hasDes? ' Description |' :''}`,
        `| --- |${hasType? ' --- |' :''}${hasDef? ' :---: |' :''}${hasDes? ' --- |' :''}`,
        ...data.map(v => {
          const vtags = v.jsTags || [];
          const def = vtags.find(tag => tag.name === 'default') || { text: '' }
          return `| ${v.name} |${
            hasType? ` ${v.type ? `\`${v.type}\`` : ''} |` :''}${
            hasDef? ` ${def.text ? `\`${def.text}\`` : ''} |` :''}${
            hasDes? ` ${(v.documentation || '').split('\n').join('<br />')}${
              vtags.length > 0 ? `${vtags
                .filter(arrs => !['default', 'supported'].includes(arrs.name))
                .map(arrs => `<br />${arrs.name}: ${arrs.text}`).join('')
            }` : ''} |` :''}`
        }),
      '']))
    } else {
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
        return splicing([
          level !== 0 ? `${'#'.repeat(level + 1)} ${param.name}\n` : undefined,
          get.document(param.documentation),
          get.since(tags.find(tag => tag.name === 'since')),
          get.type(param.type),
          get.see(tags.find(tag => tag.name === 'see')),
        ])
      }))
    }

    return splicing(methods)
  },
  parameters: (data?: DocEntry[]) => {
    const parameters = data && data.map(param => {
      const tags = param.jsTags || []
      // 'OffLoadCallback' === param.name && console.log(JSON.stringify(param))
      return splicing([
        `### ${param.name}`,
        '',
        get.document(param.documentation),
        get.since(tags.find(tag => tag.name === 'since')),
        get.members(param.members, 4),
        get.example(tags),
        get.see(tags.find(tag => tag.name === 'see')),
      ]) || undefined
    })

    return parameters && parameters.filter(e => !!e).length > 0 ? splicing(['## 参数', '', ...parameters, '']) : undefined
  },
  example: (tags: ts.JSDocTagInfo[]) => {
    const array: string[] = []
    let exampleIdx = tags.findIndex(tag => tag.name === 'example')
    let exampleNum = 0
    do {
      const example = tags[exampleIdx]
      if (example) {
        exampleNum === 0 && array.push('## 示例代码', '')
        exampleNum++
        if ((exampleIdx = tags.findIndex((tag, i) => exampleIdx < i && tag.name === 'example')) > -1 || exampleNum > 1) {
          array.push(`### 示例 ${exampleNum}`, '')
        }
        array.push((example.text || '').split('\\`@').join('@'), '')
      }
    } while (exampleIdx > -1)

    return array.length > 0 ? splicing(array) : undefined
  },
  api: (data: {[name: string]: ts.JSDocTagInfo[]}) => {
    const isSupported = Object.values(data).find(tags => tags.find(tag => tag.name === 'supported'))
    const titles = envMap.reduce((p, env) => `${p} ${env.label} |`, '| API |')
    const splits = envMap.reduce((p) => `${p} :---: |`, '| :---: |')
    const rows = Object.keys(data).map(name => {
      const tags = data[name]
      const supported = tags.find(tag => tag.name === 'supported')
      const apis = (supported && supported.text || '').split(',').map(e => e.trim().toLowerCase())

      return `| Taro.${name} |${envMap.map(env => {
        const apiName = apis.find(e => e === env.name)
        const apiDesc = tags.find(e => e.name === apiName)
        return ` ${apiName ? '✔️': ''}${apiDesc && apiDesc.text ? `(${apiDesc.text})` : ''} |`
      }).join('')}`
    })

    return isSupported ? splicing([
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
    const md: (string | undefined)[] = []
    ;(!FunctionFlags.includes(e.flags || -1) && !isntTaroMethod.includes(e.flags || -1)) && console.log(e.flags, name)

    if (name === 'General' && !withGeneral) {
      return
    }

    md.push(
      get.header({ title: get.title(name, params, e.flags), sidebar_label: name }),
      get.document(e.documentation),
      get.since(tags.find(tag => tag.name === 'since')),
      get.type(e.type, 2),
      get.parameters(e.exports),
      get.members(e.members),
      get.example(tags),
      get.api({ [name]: tags }),
      get.see(tags.find(tag => tag.name === 'see')),
      // JSON.stringify(e, undefined, 2),
    )

    writeFile(
      path.resolve(_p.name === 'index' ? _p.dir : routepath, `${name}.md`),
      splicing(md),
    )
  })
}

// docsAPI('./types/api', './apis', ['./types/api'], writeJson)
// docsAPI('./types/api', './apis', ['./types/index'], writeDoc)
docsAPI('./types/api', '../../docs/apis', ['./types/api'], writeDoc)

function splicing (arr: (string | undefined)[] = []) {
  return arr.filter(e => typeof e === 'string').join('\n')
}