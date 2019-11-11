import * as path from "path"
import * as ts from "typescript"
import compile, { DocEntry, envMap } from "./parser"
import writeFile from "./write"

type TCallback = (routepath: string, doc: DocEntry[]) => void

export default function docsAPI (
  base: string = '.',
  out: string,
  files: string[],
  callback: TCallback = () => {},
  withLog = true,
) {
  const cwd: string = process.cwd();
  const basepath: string = path.resolve(cwd, base);
  files.forEach(async s => {
    compile(cwd, s, (docTree) => {
      Object.keys(docTree).forEach(e => {
        const doc = docTree[e]
        const isOutput = e.search(basepath)
        if (isOutput > -1) {
          const output = e
            .replace(basepath, path.resolve(cwd, out))
            .replace(/(.[a-z]+)$|(.d.ts)$/ig, '')
          withLog && console.log(e)
          if (doc.length < 1) return
          callback(output, doc)
        }
      })
    })
  })
}

export function childrenMerge (d: DocEntry[] = [], o: DocEntry[] = []) {
  d.forEach(e => {
    const name = e.name || 'undefined'
    const target = o.find(v => v.name === name)
    if (!target) o.push(e)
    else {
      for (const key in e) {
        if (e.hasOwnProperty(key) && e[key] && !['name', 'kind', 'flags'].includes(key)) {
          if (key === 'children') {
            if (!target.children) {
              target.children = childrenMerge(e.children)
            }
          } else if (key === 'exports') {
            if (!target.exports) {
              target.exports = childrenMerge(e.exports)
            }
          } else {
            target[key] = e[key]
          }
        }
      }
    }
  })
  o.forEach((e: DocEntry) => {
    if (e.children) {
      if (!e.exports) e.exports = [];
      (e.children || []).forEach(k => {
        const kk = e.exports!.find(kk => kk.name === k.name)
        if (!kk) e.exports!.push(k)
        else Object.assign(kk, k)
      })
      delete e.children
    }
  })
  return o
}

export function writeJson (routepath: string, doc: DocEntry[]) {
  const parseData = childrenMerge(doc)
  const Taro = parseData.find(e => e.name === 'Taro')

  writeFile(`${routepath}.json`, JSON.stringify(Taro, undefined, 2))
}

const get = {
  header: (data: {
    title: string
    sidebar_label: string
    [key: string]: string
  }) => splicing(['---', ...Object.keys(data).map(key => `${key}: ${data[key]}`), '---', '']),
  document: (data?: string) => data ? splicing([data, '']) : undefined,
  since: (data?: ts.JSDocTagInfo) => data ? splicing([`> 最低 Taro 版本: ${data.text || ''}`, '']) : undefined,
  type: (data?: string, withTitle = false) => data && data !== 'InterfaceDeclaration' ?
    splicing([withTitle ? '## 类型' : undefined, withTitle ? '' : undefined, '```tsx', data, '```', '']) : undefined,
  members: (data?: DocEntry[], level: number = 2) => {
    return data && data.length > 0 ? splicing([`${'#'.repeat(level)} 方法`, '', ...data.map(param => {
      param.name === 'offClose' && console.log(param)
      const tags = param.jsTags || []
      const members = param.members || []
      const paramLens = members.reduce((s, v) => v.name !== ts.InternalSymbolName.Call && ++s, 0)

      if (param.name && ts.InternalSymbolName.Call) {
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

      if (paramLens > 0) {
        const hasType = members.some(v => !!v.type && v.type !== param.name)
        const hasDef = members.some(v => !!v.jsTags && v.jsTags.some(vv => vv.name === 'default'))
        const hasDes = members.some(v => !!v.documentation)

        return splicing([
          `${'#'.repeat(level + 1)} ${param.name}`, '',
          `| Name |${hasType? ' Type |' :''}${hasDef? ' Default |' :''}${hasDes? ' Description |' :''}`,
          `| --- |${hasType? ' --- |' :''}${hasDef? ' :---: |' :''}${hasDes? ' --- |' :''}`,
          ...members.map(v => {
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
        ''])
      }

      return splicing([
        `${'#'.repeat(level + 1)} ${param.name}`,
        '',
        get.document(param.documentation),
        get.since(tags.find(tag => tag.name === 'since')),
        get.type(param.type),
        get.see(tags.find(tag => tag.name === 'see')),
      ])
    }), '']) : undefined
  },
  parameters: (data?: DocEntry[]) => {
    const parameters = data && data.map(param => {
      const paramExports = param.exports || []
      const hasType = paramExports.some(v => !!v.type && v.type !== param.name)
      const hasDef = paramExports.some(v => !!v.jsTags && v.jsTags.some(vv => vv.name === 'default'))
      const hasDes = paramExports.some(v => !!v.documentation)
      const paramLens = paramExports.reduce((s, v) => v.name !== ts.InternalSymbolName.Call && ++s, 0)

      if (paramLens > 0) {
        return splicing([
          `### ${param.name}`, '',
          `| Name |${hasType? ' Type |' :''}${hasDef? ' Default |' :''}${hasDes? ' Description |' :''}`,
          `| --- |${hasType? ' --- |' :''}${hasDef? ' :---: |' :''}${hasDes? ' --- |' :''}`,
          ...paramExports.map(v => {
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
        ''])
      } else {
        const callback = paramExports.find(e => e.name === ts.InternalSymbolName.Call)
        const documentation = callback && callback.documentation
        const tags = callback && callback.jsTags || []
        const declarations = callback && callback.declarations || []
        const call_decla = declarations[0]

        return call_decla && splicing([
          `### ${param.name}`,
          '',
          get.document(documentation),
          get.since(tags.find(tag => tag.name === 'since')),
          get.type(param.type),
          get.members(param.members, 3),
          get.example(tags),
          get.see(tags.find(tag => tag.name === 'see')),
        ]) || undefined
      }
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

export function writeDoc (routepath: string, doc: DocEntry[]) {
  const _p = path.parse(routepath)
  const parseData = childrenMerge(doc)
  const Taro = parseData.find(e => e.name === 'Taro')

  Taro && (Taro.exports || []).forEach(e => {
    const name = e.name || 'undefined'
    const tags = e.jsTags || []
    const params = e.parameters || []
    const md: (string | undefined)[] = []

    if (name === 'InterstitialAd') console.log(JSON.stringify(e))
    
    md.push(
      get.header({
        title: `Taro.${name}(${params.map(param => param.name).join(', ')})`,
        sidebar_label: name
      }),
      get.document(e.documentation),
      get.since(tags.find(tag => tag.name === 'since')),
      get.type(e.type, true),
      get.parameters(e.exports),
      get.members(e.members),
      get.example(tags),
      get.api({ [name]: tags }),
      get.see(tags.find(tag => tag.name === 'see')),
      // JSON.stringify(e, undefined, 2),
    )
    name === 'InterstitialAd' && console.log(md)

    writeFile(
      path.resolve(_p.name === 'index' ? _p.dir : routepath, `${name}.md`),
      splicing(md),
    )
  })
}

// docsAPI('./types/api', './apis', ['./types/index.d.ts'], writeJson)
// docsAPI('./types/api', './apis', ['./types/api/'], writeDoc)
docsAPI('./types/api', '../../docs/apis', ['./types/api/'], writeDoc)

function splicing (arr: (string | undefined)[] = []) {
  return arr.filter(e => typeof e === 'string').join('\n')
}