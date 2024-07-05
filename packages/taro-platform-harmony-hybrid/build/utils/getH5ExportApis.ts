import * as fsExtra from 'fs-extra'
import * as pathModule from 'path'

import { removeComments } from './helper'

/**
 * 匹配API定义文件，提取H5导出的API名字
 *
 * @param h5ApiFiles 传入API定义文件列表
 * @returns 返回api列表
 */
function getH5ApiList (h5ApiFiles: string[]) {
  const h5ApiList: string[] = []
  h5ApiFiles.forEach(filePath => {
    const content = fsExtra.readFileSync(filePath, 'utf-8')
    const apiFileContent = removeComments(content)
    const apiPattern = /export function ([a-zA-Z0-9]+)|export const ([a-zA-Z0-9]+)|export \{([^}]+)\}/g
    let apiPatternMatch: RegExpExecArray | null
    while ((apiPatternMatch = apiPattern.exec(apiFileContent)) !== null) {
      if (apiPatternMatch[1]) {
        h5ApiList.push(apiPatternMatch[1])
      } else if (apiPatternMatch[2]) {
        h5ApiList.push(apiPatternMatch[2])
      } else {
        const apiList = apiPatternMatch[3].split(',')
        apiList.forEach(api => {
          h5ApiList.push(api.trim())
        })
      }
    }
  })
  // cloud在H5定义中是一个类,导出为export class cloud，此处单独处理
  h5ApiList.push('cloud')

  return h5ApiList
}

export function getH5ExportApis () {
  const entryPath = require.resolve('@tarojs/taro-h5/src/api/index.ts')
  const h5ApiDir = pathModule.dirname(entryPath)
  const h5ApiFiles: string[] = []

  function getH5ApiFiles (dir: string) {
    const files = fsExtra.readdirSync(dir)
    files.forEach(file => {
      const filePath = pathModule.join(dir, file)
      const stats = fsExtra.statSync(filePath)
      if (stats.isDirectory()) {
        getH5ApiFiles(filePath) // 如果是目录，则递归处理
      } else {
        if (file !== 'taro.ts') {
          h5ApiFiles.push(filePath)
        }
      }
    })
  }
  getH5ApiFiles(h5ApiDir)
  const h5ApiList = getH5ApiList(h5ApiFiles)

  return h5ApiList
}