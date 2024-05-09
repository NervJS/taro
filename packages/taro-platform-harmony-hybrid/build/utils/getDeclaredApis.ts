import * as fsExtra from 'fs-extra'
import * as pathModule from 'path'

import { removeComments } from './helper'

function getDeclaredContent (declareFiles: string[]) {
  const apisContentArr: string[] = []
  declareFiles.forEach(filePath => {
    const content = fsExtra.readFileSync(filePath, 'utf-8')
    const apiDeclareFlag = `interface TaroStatic`
    const startIndex = content.indexOf(apiDeclareFlag)
    if (startIndex > 0) {
      let apisContent = ''
      let stack = 0
      let findLeftBrackets = false
      for (let i = startIndex; i < content.length && (!findLeftBrackets || stack > 0); i++) {
        if (content[i] === '{') {
          findLeftBrackets = true
          stack += 1
        } else if (content[i] === '}') {
          stack -= 1
        }
        if (findLeftBrackets) {
          apisContent += content[i]
        }
      }
      apisContentArr.push(apisContent)
    }
  })
  return apisContentArr
}

function getApisObj (declareContent: string) {
  const apisObj: object = {}
  const apiContentPattern = /(\/\*\*[\s\S]*?\*\/[\s\S]*?)(?=\/\*\*|}$)/g
  const supportedPattern = /@supported([^*]+)/
  let apiContentMatch: RegExpExecArray | null
  while ((apiContentMatch = apiContentPattern.exec(declareContent)) !== null) {
    const supportedMatch = apiContentMatch[1].match(supportedPattern)
    let supportedArr: string[] = []
    if (supportedMatch) {
      // 获取API支持的平台
      supportedArr = supportedMatch[1].split(',').map(platform => platform.trim())
    }
    // 获取API名字
    const apiMatch = removeComments(apiContentMatch[1]).match(/^\s*([a-zA-Z0-9]+)[^(]*?\(/)
    if (apiMatch && apiMatch[1] !== 'callback') {
      apisObj[apiMatch[1]] = supportedArr
    }
  }
  return apisObj
}

/**
 * 获取taro已声明的API,不含Hooks/拓展API以及Taro官网的env/cloud/console
 *
 * @returns 返回一个key为API名字，value为支持平台数组的对象
 */
export function getDeclaredApis () {
  const entryPath = require.resolve('@tarojs/taro/types/api/taro.hooks.d.ts')
  const declareDir = pathModule.dirname(entryPath)
  const declareFiles: string[] = []
  const declareApis: object = {}

  function getDeclareFiles (dir: string) {
    const files = fsExtra.readdirSync(dir)
    files.forEach(file => {
      const filePath = pathModule.join(dir, file)
      const stats = fsExtra.statSync(filePath)
      if (stats.isDirectory()) {
        getDeclareFiles(filePath) // 如果是目录，则递归处理
      } else {
        if (file !== 'taro.extend.d.ts' && file !== 'taro.hooks.d.ts') {
          declareFiles.push(filePath)
        }
      }
    })
  }

  getDeclareFiles(declareDir)
  const apiDeclareContents = getDeclaredContent(declareFiles)
  apiDeclareContents.forEach(content => {
    Object.assign(declareApis, getApisObj(content))
  })

  return declareApis
}