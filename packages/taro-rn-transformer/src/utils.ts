import * as nodePath from 'path'
import * as fs from 'fs'
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
  const dirname = nodePath.dirname(file).replace(/\\/g, '/')
  const fileObj = nodePath.parse(file)
  const name = fileObj.name.split('.')[0]
  const filePath = `${dirname}/${name}`
  const filename = nodePath.basename(file).replace(nodePath.extname(file), '')
  return pagesList.includes(filePath) && !(filename.endsWith('.config'))
}

export function getFileContent (fileName: string) {
  let code = ''
  if (!fs.existsSync(fileName)) return code
  try {
    code = fs.readFileSync(fileName, 'utf-8').toString()
  } catch (error) {
    code = ''
  }
  return code
}

export function getCommonStyle (appPath: string, basePath: string) {
  let styles: Record<string, string>[] = []
  // 读取入口文件的内容
  const jsExt: string[] = ['tsx', 'ts', 'jsx', 'js']
  let codeStr = ''
  // 先读带rn后缀的
  for (let i = 0; i < jsExt.length; i++) {
    const rnfilePath = `${appPath}.rn.${jsExt[i]}`
    const rnFileContent: string = getFileContent(rnfilePath)
    if (!rnFileContent) {
      codeStr = rnFileContent
      break
    }
  }
  // 不带rn后缀的
  if (!codeStr) {
    for (let i = 0; i < jsExt.length; i++) {
      const filePath = `${appPath}.${jsExt[i]}`
      const fileContent: string = getFileContent(filePath)
      if (fileContent) {
        codeStr = fileContent
        break
      }
    }
  }
  if (!codeStr) return styles
  styles = getStyleCode(codeStr, basePath)
  return styles
}
