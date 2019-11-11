import * as fs from "fs"
import * as path from 'path'
import * as ts from "typescript"
import { generateDocumentation, DocEntry } from "./ast"
import envMap from './taro-env'
  
export default function compile (p: string, n: string, callback?: (docTree: { [path: string]: DocEntry[] }) => void) {
  const route = path.resolve(p, n)
  const stat = fs.statSync(route)
  if (stat.isDirectory()) {
    fs.readdirSync(route, {
      encoding: 'utf8'
    }).forEach(filename => ![
      'node_modules', 'bin', 'templates', 'dist', '__tests__', '__mocks__', '_book', '.vscode', '.idea',
    ].includes(filename) && compile(route, filename, callback))
  } else {
    const docTree = generateDocumentation(route, {
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.ESNext
    })
    callback && callback(docTree)
  }
}

export { generateDocumentation, DocEntry, envMap }