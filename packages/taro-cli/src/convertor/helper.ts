import * as path from 'path'
import * as fs from 'fs-extra'
import * as t from 'babel-types'

import {
  printLog,
  promoteRelativePath,
  resolveScriptPath
} from '../util'

import {
  processTypeEnum,
  REG_SCRIPT,
  REG_TYPESCRIPT
} from '../util/constants'

export function analyzeImportUrl (
  sourceFilePath: string,
  scriptFiles: Set<string>,
  source: t.StringLiteral,
  value: string
) {
  const valueExtname = path.extname(value)
  if (path.isAbsolute(value)) {
    printLog(processTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 是绝对路径！`)
    return
  }
  if (value.indexOf('.') === 0) {
    if (REG_SCRIPT.test(valueExtname) || REG_TYPESCRIPT.test(valueExtname)) {
      const vpath = path.resolve(sourceFilePath, '..', value)
      let fPath = value
      if (fs.existsSync(vpath)) {
        fPath = vpath
      } else {
        printLog(processTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
      }
      scriptFiles.add(fPath)
    } else {
      let vpath = resolveScriptPath(path.resolve(sourceFilePath, '..', value))
      if (vpath) {
        if (!fs.existsSync(vpath)) {
          printLog(processTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
        } else {
          if (fs.lstatSync(vpath).isDirectory()) {
            if (fs.existsSync(path.join(vpath, 'index.js'))) {
              vpath = path.join(vpath, 'index.js')
            } else {
              printLog(processTypeEnum.ERROR, '引用目录', `文件 ${sourceFilePath} 中引用了目录 ${value}！`)
              return
            }
          }
          let relativePath = path.relative(sourceFilePath, vpath)
          const relativePathExtname = path.extname(relativePath)
          scriptFiles.add(vpath)
          relativePath = promoteRelativePath(relativePath)
          if (/\.wxs/.test(relativePathExtname)) {
            relativePath += '.js'
          } else {
            relativePath = relativePath.replace(relativePathExtname, '.js')
          }
          source.value = relativePath
        }
      }
    }
  }
}
