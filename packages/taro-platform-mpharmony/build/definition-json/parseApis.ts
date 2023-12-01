import * as fs from 'fs-extra'
import * as pathModule from 'path'

/**
 * 解析API注释信息
 * 
 * @returns { object } apisDefinition - 返回api支持情况对象
 */
export function parseApis () {
  const entryPath = require.resolve('@tarojs/taro-mpharmony/src/index.ts')
  const apisDir = pathModule.dirname(entryPath)
  const commentArray: string[] = []
  const apisDefinition: object = {}

  function readFilesRecursively (dir: string) {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const filePath = pathModule.join(dir, file)
      const stats = fs.statSync(filePath)
      if (stats.isDirectory()) {
        readFilesRecursively(filePath) // 如果是目录，则递归处理
      } else {
        const content = fs.readFileSync(filePath, 'utf-8')
        const commentPattern = /(\/\*\*[\s\S]*?\*\/)/g
        const canIUsePattern = /@canUse|@canNotUse/g
        let matches: RegExpExecArray | null
        while ((matches = commentPattern.exec(content)) !== null) {
          if (matches[1].match(canIUsePattern)) {
            commentArray.push(matches[1])
          }
        }
      }
    })
  }

  readFilesRecursively(apisDir)

  // 获取调用方式标签后的内容，返回一个属性的对象
  function getObj (callMethod: string, comment: string) {
    let propObj: object = {}
    const objectPattern = new RegExp(callMethod + '[^\\[]*(\\[[\\s\\S]*?\\])(?=\\s*?\\*\\s*?@|\\s*?\\*\\/$)', 'g')
    let match: RegExpExecArray | null
    if ((match = objectPattern.exec(comment)) !== null) {
      const str = match[1].replace(/[\s*\\]/g, '') // 清除空白字符和\
      const jsonStr = str
        .replace(/\[/g, '{')
        .replace(/\]/g, '}')
        .replace(/\b([\w-]+)\b/g, '"$1":')
        .replace(/(:)(?=[^{])/g, '$1true')
      try {
        propObj = JSON.parse(jsonStr)
      } catch (error) {
        propObj = {}
      }
      objectPattern.lastIndex = 0 // 只需匹配一次，重置正则表达式的位置
    }
    return propObj
  }

  // 根据API的注释，返回API信息的描述对象
  function getApiInfos (comment: string) {
    let apiInfo: object = {}
    if (comment.includes('@__object')) {
      const ret = getObj('@__object', comment)
      if (Object.keys(ret).length !== 0) {
        apiInfo = { ...apiInfo, object: ret }
      }
    }
    if (comment.includes('@__return')) {
      const ret = getObj('@__return', comment)
      if (Object.keys(ret).length !== 0) {
        apiInfo = { ...apiInfo, return: ret }
      }
    }
    if (comment.includes('@__success')) {
      const ret = getObj('@__success', comment)
      if (Object.keys(ret).length !== 0) {
        apiInfo = { ...apiInfo, success: ret }
      }
    }
    if (comment.includes('@__callback')) {
      const ret = getObj('@__callback', comment)
      if (Object.keys(ret).length !== 0) {
        apiInfo = { ...apiInfo, callback: ret }
      }
    }
    if (comment.includes('@__class')) {
      const ret = getObj('@__class', comment)
      if (Object.keys(ret).length !== 0) {
        apiInfo = ret
      }
    }
    if (comment.includes('@__variable')) {
      const ret = getObj('@__variable', comment)
      if (Object.keys(ret).length !== 0) {
        apiInfo = ret
      }
    }
    return apiInfo
  }

  // 遍历所有API的注释信息
  function parseComments (commentArray: string[]) {
    const canUse = /@canUse ([a-zA-Z0-9]+)/g
    const canNotUse = /@canNotUse ([a-zA-Z0-9]+)/g
    let canUseMatch: RegExpExecArray | null
    let canNotUseMatch: RegExpExecArray | null
    commentArray.forEach(comment => {
      if ((canUseMatch = canUse.exec(comment)) !== null) {
        const apiInfoObj = getApiInfos(comment)
        if (Object.keys(apiInfoObj).length !== 0) {
          apisDefinition[canUseMatch[1]] = apiInfoObj
        } else {
          apisDefinition[canUseMatch[1]] = true
        }
        canUse.lastIndex = 0 // 重置正则表达式的位置
      } else if ((canNotUseMatch = canNotUse.exec(comment)) !== null) {
        apisDefinition[canNotUseMatch[1]] = false
        canNotUse.lastIndex = 0 // 重置正则表达式的位置
      } else {
        console.warn('Parse apis comment error!')
      }
    })
  }

  parseComments(commentArray)
  return apisDefinition
}

/**
 * 删除对象中值为false的属性,并将值为true的属性值改为''
 * 
 * @param { object} obj - 需要处理的对象
 */
export function removeFalseProperties (obj: object) {
  for (const prop in obj) {
    if (obj[prop] === false) {
      delete obj[prop]
    } else if (typeof obj[prop] === 'object') {
      removeFalseProperties(obj[prop]) // 递归处理子对象
      if (Object.keys(obj[prop]).length === 0) {
        delete obj[prop] // 如果子对象处理完毕后为空，则删除父对象中的属性
      }
    } else {
      obj[prop] = ''
    }
  }
}