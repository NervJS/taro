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
    compile(cwd, s, (routepath, doc) => {
      withLog && console.log(routepath)
      if (doc.length < 1) return
      callback(
        routepath
        .replace(basepath, path.resolve(cwd, out))
        .replace(/(.[a-z]+)$|(.d.ts)$/ig, ''),
        doc,
      )
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
  }) => ['---', ...Object.keys(data).map(key => `${key}: ${data[key]}`), '---', ''].join('\n'),
  document: (data?: string) => data ? [data, ''].join('\n') : undefined,
  since: (data?: ts.JSDocTagInfo) => data ? [`> 最低 Taro 版本: ${data.text || ''}`, ''].join('\n') : undefined,
  type: (data?: string) => data ? ['## 类型', '', '```tsx', data, '```', ''].join('\n') : undefined,
  parameters: (data?: DocEntry[]) => {
    return data && data.length > 0 ? ['## 参数', '', ...data.map(param => {
      const arr = param.members || param.exports || []
      const hasType = arr.some(v => !!v.type && v.type !== param.name)
      const hasDef = arr.some(v => !!v.jsTags && v.jsTags.some(vv => vv.name === 'default'))
      const hasDes = arr.some(v => !!v.documentation)
      const paramLens = arr.reduce((s, v) => v.name !== ts.InternalSymbolName.Call && ++s, 0)

      if (paramLens > 0) {
        return [
          `### ${param.name}`, '',
          `| Name |${hasType? ' Type |' :''}${hasDef? ' Default |' :''}${hasDes? ' Description |' :''}`,
          `| --- |${hasType? ' --- |' :''}${hasDef? ' :---: |' :''}${hasDes? ' --- |' :''}`,
          ...arr.map(v => {
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
        ''].join('\n')
      } else if (arr.length > 0) {
        const callback = arr.find(e => e.name === ts.InternalSymbolName.Call)
        const declarations = callback && callback.declarations || []
        const call_decla = declarations[0]
        return call_decla && [
          `### ${param.name}`, '',
          '```tsx',
          `(${(call_decla.parameters || [])
            .map(call_params => `${call_params.name}: ${call_params.type}`)
            .join(',')}) => ${call_decla.returnType}`,
          '```',
          '',
        ].join('\n') || undefined
      }
      return undefined
    }), ''].join('\n') : undefined
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

    return array.length > 0 ? array.join('\n') : undefined
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

    return isSupported ? [
      '## API 支持度', '', titles, splits, ...rows, ''
    ].join('\n') : undefined // ['## API 支持度', '', '> 该 api 暂不支持', ''].join('\n')
  },
  see: (data?: ts.JSDocTagInfo) => data ? [`> [参考文档](${data.text || ''})`, ''].join('\n') : undefined
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
    
    md.push(
      get.header({
        title: `Taro.${name}(${params.map(param => param.name).join(', ')})`,
        sidebar_label: name
      }),
      get.document(e.documentation),
      get.since(tags.find(tag => tag.name === 'since')),
      get.type(e.type),
      get.parameters(e.exports),
      get.example(tags),
      get.api({ [name]: tags }),
      get.see(tags.find(tag => tag.name === 'see')),
      // JSON.stringify(e, undefined, 2),
    )

    writeFile(
      path.resolve(_p.name === 'index' ? _p.dir : routepath, `${name}.md`),
      md.filter(e => typeof e === 'string').join('\n'),
    )
  })
}

// docsAPI('./types/api', './apis', ['./types/api/'], writeJson)
// docsAPI('./types/api', './apis', ['./types/api/'], writeDoc)
docsAPI('./types/api', '../../docs/apis', ['./types/api/'], writeDoc)
