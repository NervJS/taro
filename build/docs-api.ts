import * as fs from "fs"
import * as path from "path"
import * as ts from "typescript"
import { generateDocumentation, DocEntry } from "./parser"

export default function docsAPI (base: string = '.', out: string, files: string[]) {
  const cwd: string = process.cwd();
  const basepath: string = path.resolve(cwd, base);
  files.forEach(async s => {
    compile(cwd, s, (routepath, doc) => {
      console.log(routepath, doc.length)
      if (doc.length < 1) return
      const outpath: string = routepath
        .replace(basepath, path.resolve(cwd, out))
        .replace(/(.[a-z]+)$|(.d.ts)$/ig, '')
      try {
        writeDoc(outpath, doc)
      } catch (error) {
        fs.mkdirSync(path.parse(outpath).dir, { recursive: true })
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
  fs.writeFileSync(
    `${routepath}.md`,
    JSON.stringify(doc, undefined, 4),
    {}
  )
}

// docsAPI('.', process.argv[2], process.argv.slice(3))
docsAPI('./packages/taro/types/api', 'api', ['./packages/taro/types/api/'])
