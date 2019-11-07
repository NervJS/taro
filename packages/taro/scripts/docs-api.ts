import * as fs from "fs"
import * as path from "path"
import * as ts from "typescript"
import { generateDocumentation, DocEntry } from "./parser"
import envMap from './parser/taro-env'

export default function docsAPI (base: string = '.', out: string, files: string[]) {
  const cwd: string = process.cwd();
  const basepath: string = path.resolve(cwd, base);
  files.forEach(async s => {
    compile(cwd, s, (routepath, doc) => {
      console.log(routepath) // , doc.length)
      if (doc.length < 1) return
      const outpath: string = routepath
        .replace(basepath, path.resolve(cwd, out))
        .replace(/(.[a-z]+)$|(.d.ts)$/ig, '')
      try {
        writeDoc(outpath, doc)
      } catch (error) {
        const _p = path.parse(outpath)
        fs.mkdirSync(_p.name === 'index' ? _p.dir : outpath, { recursive: true })
        writeDoc(outpath, doc)
      }
    })
  })
}
  
export function compile (p: string, n: string, callback?: (routepath: string, doc: DocEntry[]) => void) {
  const route = path.resolve(p, n)
  const stat = fs.statSync(route)
  if (stat.isDirectory()) {
    fs.readdirSync(route, {
      encoding: 'utf8'
    }).forEach(filename => ![
      'node_modules', 'bin', 'templates', 'dist', '__tests__', '__mocks__', '_book', '.vscode', '.idea'
    ].includes(filename) && compile(route, filename, callback))
  } else {
    const docTree = generateDocumentation(route, {
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.ESNext
    })
    callback && callback(route, docTree)
  }
}

export function writeJson (routepath: string, doc: DocEntry[]) {
  fs.writeFileSync(
    `${routepath}.json`,
    JSON.stringify(doc, undefined, 4),
    {}
  )
}

export function writeDoc (routepath: string, doc: DocEntry[]) {
  const _p = path.parse(routepath)
  const Taro = merge()[0]

  function merge (d: DocEntry[] = doc, o: DocEntry[] = []) {
    d.forEach(e => {
      const name = e.name || 'undefined'
      const target = o.find(v => v.name === name)
      if (name === 'onAccelerometerChange') console.log(JSON.stringify(e.children, undefined, 2))
      if (!target) o.push(e)
      else {
        for (const key in e) {
          if (e.hasOwnProperty(key) && e[key] && !['name', 'kind', 'flags'].includes(key)) {
            if (key === 'children') {
              if (!target.children) {
                target.children = merge(e.children)
              }
            } else if (key === 'exports') {
              if (!target.exports) {
                target.exports = merge(e.exports)
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

  (Taro.exports || []).forEach(e => {
    const name = e.name || 'undefined'
    const tags = e.jsTags || []
    const params = e.parameters || []
    const parameters = e.exports || []
    const md: string[] = [
      '---',
      `title: Taro.${name}(${params.map(param => param.name).join(', ')})`,
      `sidebar_label: ${name}`, '---',
      ''
    ]
    e.documentation && md.push(e.documentation, '')
    const since = tags.find(tag => tag.name === 'since')
    since && md.push(`> 最低版本: ${since.text || ''}`, '')
    e.type && md.push('## 类型', '', '```tsx', e.type, '```', '')
    parameters.length && md.push('## 参数', '')
    parameters.map(p => {
      const arr = p.members || p.exports || []
      const hasType = arr.some(v => !!v.type && v.type !== p.name)
      const hasDef = arr.some(v => !!v.jsTags && v.jsTags.some(vv => vv.name === 'default'))
      const hasDes = arr.some(v => !!v.documentation)
      const _param = params.find(e => e.type === p.name)
      const p_lens = arr.reduce((s, v) => v.name !== ts.InternalSymbolName.Call && ++s, 0)

      arr.length > 0 && md.push(`### ${p.name}${_param ? ` ${_param.name}` : ''}`, '')

      if (p_lens > 0) {
        md.push(`| Name |${hasType? ' Type |' :''}${hasDef? ' Default |' :''}${hasDes? ' Description |' :''}`,
          `| --- |${hasType? ' --- |' :''}${hasDef? ' :---: |' :''}${hasDes? ' --- |' :''}`,
          ...arr.map(v => {
            const vtags = v.jsTags || [];
            const def = vtags.find(tag => tag.name === 'default') || { text: '' }
            return `| ${v.name} |${
              hasType? ` ${v.type ? `\`${v.type}\`` : ''} |` :''}${
              hasDef? ` ${def.text ? `\`${def.text}\`` : ''} |` :''}${
              hasDes? ` ${v.documentation || ''}${
                vtags.length > 0 ? `${vtags
                  .filter(arrs => !['default', 'supported'].includes(arrs.name))
                  .map(arrs => `<br />${arrs.name}: ${arrs.text}`).join('')
              }` : ''} |` :''}`
          }),
        '')
      } else if (arr.length > 0) {
        const callback = arr.find(e => e.name === ts.InternalSymbolName.Call)
        const declarations = callback && callback.declarations || []
        const call_decla = declarations[0]
        call_decla && md.push(
          '```tsx',
          `(${(call_decla.parameters || [])
            .map(call_params => `${call_params.name}: ${call_params.type}`)
            .join(',')}) => ${call_decla.returnType}`,
          '```',
          '',
        )
      }
    })
    const example = tags.find(tag => tag.name === 'example')
    example && md.push('## 示例代码', '', example.text || '', '')
    const supported = tags.find(tag => tag.name === 'supported')
    const apis = getAPI(name, supported && supported.text)
    apis.length > 0 && md.push('## API 支持度', '', ...apis,
    '')
    const see = tags.find(tag => tag.name === 'see')
    see && md.push(`> [参考文档](${see.text || ''})`, '')
    // md.push(JSON.stringify(e, undefined, 2))

    fs.writeFileSync(
      path.resolve(_p.name === 'index' ? _p.dir : routepath, `${name}.md`),
      md.join('\n'),
      {},
    )
  })

  function getAPI (name: string, text?: string) {
    if (!text)
      return []
    const apis = text.split(',').map(e => e.trim().toLowerCase())
    let titles = '| API |'
    let splits = `| :---: |`
    let row = `| Taro.${name} |`
    for (let i = 0; i < envMap.length; i++) {
      if (apis.find(e => e === envMap[i].name)) {
        titles += ` ${envMap[i].label} |`
        splits += ' :---: |'
        row += ' ✔️ |'
      }
    }
    return [titles, splits, row]
  }
}

// docsAPI('.', process.argv[2], process.argv.slice(3))
docsAPI('./types/api', '../../docs/apis', ['./types/api/'])
