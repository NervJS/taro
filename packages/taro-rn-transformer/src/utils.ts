import * as nodePath from 'path'
import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import { readConfig, resolveMainFilePath } from '@tarojs/helper'
import { globalAny } from './types/index'

const RN_CSS_EXT = ['.css', '.scss', '.sass', '.less', '.styl', '.stylus']

export function getConfigFilePath (filePath: string) {
  return resolveMainFilePath(`${filePath.replace(nodePath.extname(filePath), '')}.config`)
}

export function getConfigContent (path: string) {
  if (!path) return {}
  const fileConfigPath = getConfigFilePath(path)
  const content = readConfig(fileConfigPath)
  return content
}

export function getStyleCode (code: string, basePath: string) {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'typescript',
      'classProperties',
      'decorators-legacy'
    ]
  })

  const styleTypes = RN_CSS_EXT
  const styleSource: Record<string, string>[] = []
  traverse(ast, {
    ImportDeclaration (path) {
      const node = path.node
      const resource: string = node.source.value
      const ext = nodePath.extname(resource)
      // 是否是样式文件
      if (!styleTypes.includes(ext)) {
        return
      }
      let sourceName = ''
      if (node.specifiers.length) {
        sourceName = node.specifiers[0].local.name
      }
      const realPath = nodePath.resolve(basePath, resource)
      const fileName = nodePath.basename(realPath)
      styleSource.push({
        name: sourceName,
        path: realPath,
        fileName: fileName
      })
    }
  })
  return styleSource
}

export function isPageFile (file: string, sourceDir: string) {
  if ((/node_modules/.test(file)) || file.indexOf(sourceDir) === -1) return false
  const pagesList = globalAny.__taroAppPages || []
  const filePath = file.split('.')[0]
  return pagesList.includes(filePath) || filePath === `${sourceDir}/app`
}
