import * as path from 'path'
import * as fs from 'fs-extra'

import { mergeWith } from 'lodash'
import * as chalk from 'chalk'
import * as babel from '@babel/core'

import {
  NODE_MODULES_REG,
  processTypeMap,
  processTypeEnum,
  SCRIPT_EXT
} from './constants'

export const isNodeModule = (filename: string) => NODE_MODULES_REG.test(filename)

export function isNpmPkg (name: string): boolean {
  if (/^(\.|\/)/.test(name)) {
    return false
  }
  return true
}

export function isEmptyObject (obj: any): boolean {
  if (obj == null) {
    return true
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false
    }
  }
  return true
}

export function isAliasPath (name: string, pathAlias: object = {}): boolean {
  const prefixs = Object.keys(pathAlias)
  if (prefixs.length === 0) {
    return false
  }
  return prefixs.includes(name) || (new RegExp(`^(${prefixs.join('|')})/`).test(name))
}

export function replaceAliasPath (filePath: string, name: string, pathAlias: object = {}) {
  // 后续的 path.join 在遇到符号链接时将会解析为真实路径，如果
  // 这里的 filePath 没有做同样的处理，可能会导致 import 指向
  // 源代码文件，导致文件被意外修改
  filePath = fs.realpathSync(filePath)

  const prefixs = Object.keys(pathAlias)
  if (prefixs.includes(name)) {
    return promoteRelativePath(path.relative(filePath, fs.realpathSync(resolveMainFilePath(pathAlias[name]))))
  }
  const reg = new RegExp(`^(${prefixs.join('|')})/(.*)`)
  name = name.replace(reg, function (m, $1, $2) {
    return promoteRelativePath(path.relative(filePath, path.join(pathAlias[$1], $2)))
  })
  return name
}

export function promoteRelativePath (fPath: string): string {
  const fPathArr = fPath.split(path.sep)
  let dotCount = 0
  fPathArr.forEach(item => {
    if (item.indexOf('..') >= 0) {
      dotCount++
    }
  })
  if (dotCount === 1) {
    fPathArr.splice(0, 1, '.')
    return fPathArr.join('/')
  }
  if (dotCount > 1) {
    fPathArr.splice(0, 1)
    return fPathArr.join('/')
  }
  return fPath.replace(/\\/g, '/')
}

export function resolveMainFilePath (p: string, extArrs = SCRIPT_EXT): string {
  const realPath = p
  const taroEnv = process.env.TARO_ENV
  for (let i = 0; i < extArrs.length; i++) {
    const item = extArrs[i]
    if (taroEnv) {
      if (fs.existsSync(`${p}.${taroEnv}${item}`)) {
        return `${p}.${taroEnv}${item}`
      }
      if (fs.existsSync(`${p}${path.sep}index.${taroEnv}${item}`)) {
        return `${p}${path.sep}index.${taroEnv}${item}`
      }
      if (fs.existsSync(`${p.replace(/\/index$/, `.${taroEnv}/index`)}${item}`)) {
        return `${p.replace(/\/index$/, `.${taroEnv}/index`)}${item}`
      }
    }
    if (fs.existsSync(`${p}${item}`)) {
      return `${p}${item}`
    }
    if (fs.existsSync(`${p}${path.sep}index${item}`)) {
      return `${p}${path.sep}index${item}`
    }
  }
  return realPath
}

export const recursiveMerge = <T = any>(src: Partial<T>, ...args: Array<Partial<T> | undefined>) => {
  return mergeWith(src, ...args, (value, srcValue) => {
    const typeValue = typeof value
    const typeSrcValue = typeof srcValue
    if (typeValue !== typeSrcValue) return
    if (Array.isArray(value) && Array.isArray(srcValue)) {
      return value.concat(srcValue)
    }
    if (typeValue === 'object') {
      return recursiveMerge(value, srcValue)
    }
  })
}

export function getInstalledNpmPkgPath (pkgName: string, basedir: string): string | null {
  const resolvePath = require('resolve')
  try {
    return resolvePath.sync(`${pkgName}/package.json`, { basedir })
  } catch (err) {
    return null
  }
}

export function printLog (type: processTypeEnum, tag: string, filePath?: string) {
  const typeShow = processTypeMap[type]
  const tagLen = tag.replace(/[\u0391-\uFFE5]/g, 'aa').length
  const tagFormatLen = 8
  if (tagLen < tagFormatLen) {
    const rightPadding = new Array(tagFormatLen - tagLen + 1).join(' ')
    tag += rightPadding
  }
  const padding = ''
  filePath = filePath || ''
  if (typeof typeShow.color === 'string') {
    console.log(chalk[typeShow.color](typeShow.name), padding, tag, padding, filePath)
  } else {
    console.log(typeShow.color(typeShow.name), padding, tag, padding, filePath)
  }
}

export function removeHeadSlash (str: string) {
  return str.replace(/^(\/|\\)/, '')
}

export function readConfig (configPath: string) {
  if (fs.existsSync(configPath)) {
    try {
      delete require.cache[require.resolve(configPath)]
      const config = require(configPath)
      return config
    } catch (error) {
      const res = babel.transformFileSync(configPath, {
        presets: [['@babel/env']],
        plugins: ['@babel/plugin-proposal-class-properties']
      })
      return eval(res!.code as string)
    }
  }
  return {}
}
