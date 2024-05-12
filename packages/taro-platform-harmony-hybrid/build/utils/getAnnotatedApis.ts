import * as fsExtra from 'fs-extra'

/**
 * 获取comments.ts中注释的API列表
 *
 * @returns api列表
 */
export function getAnnotatedApis () {
  const commentsFilePath = require.resolve('../../src/api/apis/comments.ts')
  const content = fsExtra.readFileSync(commentsFilePath, 'utf-8')
  const apiList: string[] = []
  const apiPattern = /@can[A-Za-z]+\s*?([A-Za-z0-9]+)/g
  let apiPatternMatch: RegExpExecArray | null
  while ((apiPatternMatch = apiPattern.exec(content)) !== null) {
    apiList.push(apiPatternMatch[1])
  }
  return apiList
}