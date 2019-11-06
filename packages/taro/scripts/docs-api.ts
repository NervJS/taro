import * as fs from "fs"
import * as path from "path"
import * as ts from "typescript"
import { generateDocumentation, DocEntry } from "./parser"

// import * as h5 from '@tarojs/taro-h5'
// console.log(h5)

interface DocNode {
  fileName?: string
  documentation?: string
  jsTags?: { [key: string]: string }
  type?: string
  constructors?: DocEntry[]
  parameters?: DocEntry[]
  returnType?: string
  members?: DocNode
  exports?: DocNode
  children?: DocNode
}

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
  const Taro = merge().Taro

  function merge (d: DocEntry[] = doc, o: any = {}) {
    d.forEach(e => {
      const name = e.name || 'undefined'
      if (!o[name]) o[name] = {}
      for (const key in e) {
        if (e.hasOwnProperty(key) && e[key] && !['name', 'kind', 'flags'].includes(key)) {
          if (key === 'children') {
            if (!o[name].children) {
              o[name].children = merge(e.children)
            }
          } else if (key === 'exports') {
            if (!o[name].exports) {
              o[name].exports = merge(e.exports)
            }
          } else {
            o[name][key] = e[key]
          }
        }
      }
    })
    Object.values(o).forEach((e: DocNode) => {
      if (e.children) {
        if (!e.exports) e.exports = {};
        for (const k in e.children) {
          if (e.exports[k]) {
            Object.assign(e.exports[k], e.children[k])
          } else {
            e.exports[k] = e.children[k]
          }
        }
        delete e.children
      }
      const jsTags = {}
      if (e.jsTags) {
        const tags: ts.JSDocTagInfo[] = e.jsTags as unknown as []
        tags.forEach((k: ts.JSDocTagInfo) => jsTags[k.name] = k.text || '')
      }
      e.jsTags = jsTags
    })
    return o
  }

  Object.keys(Taro.exports).forEach(name => {
    const e = Taro.exports[name]
    const tags = e.jsTags || {}
    const params = e.parameters || []
    const md: string[] = ['---', `title: Taro.${name}(${params.map(param => param.name).join(', ')})`, `sidebar_label: ${name}`, '---', '']
    e.documentation && md.push(e.documentation, '')
    e.type && md.push('## 类型', '```typescript', e.type, '```', '')
    tags.example && md.push('## 参数', tags.exports, '')
    tags.example && md.push('## 示例代码', '', tags.example, '')
    md.push(JSON.stringify(e, undefined, 2))
    fs.writeFileSync(
      path.resolve(_p.name === 'index' ? _p.dir : routepath, `${name}.md`),
      md.join('\n'),
      {}
    )
  })
}

// docsAPI('.', process.argv[2], process.argv.slice(3))
docsAPI('./types/api', '../../api', ['./types/api/'])
