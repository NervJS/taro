import * as path from 'path'
import * as fs from 'fs-extra'

import * as resolvePath from 'resolve'
import * as t from 'babel-types'
import { mergeWith, isPlainObject } from 'lodash'
import chalk from 'chalk'

import {
  CONFIG_MAP,
  JS_EXT,
  TS_EXT,
  NODE_MODULES_REG,
  processTypeMap,
  processTypeEnum,
  BUILD_TYPES,
  GLOBAL_PROPS,
  CSS_EXT
} from './constants'
import { IOption, IComponentObj } from './types'

export const isNodeModule = (filename: string) => NODE_MODULES_REG.test(filename)

export function isNpmPkg (name: string): boolean {
  if (/^(\.|\/)/.test(name)) {
    return false
  }
  return true
}

export function isQuickAppPkg (name: string): boolean {
  return /^@(system|service)\.[a-zA-Z]{1,}/.test(name)
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

export function traverseObjectNode (node, buildAdapter: string, parentKey?: string) {
  if (node.type === 'ClassProperty' || node.type === 'ObjectProperty') {
    const properties = node.value.properties
    const obj = {}
    properties.forEach(p => {
      let key = t.isIdentifier(p.key) ? p.key.name : p.key.value
      if (CONFIG_MAP[buildAdapter][key] === false) {
        return
      }
      if (parentKey !== 'usingComponents' && CONFIG_MAP[buildAdapter][key]) {
        key = CONFIG_MAP[buildAdapter][key]
      }
      obj[key] = traverseObjectNode(p.value, buildAdapter, key)
    })
    return obj
  }
  if (node.type === 'ObjectExpression') {
    const properties = node.properties
    const obj = {}
    properties.forEach(p => {
      let key = t.isIdentifier(p.key) ? p.key.name : p.key.value
      if (CONFIG_MAP[buildAdapter][key] === false) {
        return
      }
      if (parentKey !== 'usingComponents' && CONFIG_MAP[buildAdapter][key]) {
        key = CONFIG_MAP[buildAdapter][key]
      }
      obj[key] = traverseObjectNode(p.value, buildAdapter, key)
    })
    return obj
  }
  if (node.type === 'ArrayExpression') {
    return node.elements.map(item => traverseObjectNode(item, buildAdapter))
  }
  if (node.type === 'NullLiteral') {
    return null
  }
  return node.value
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
    return promoteRelativePath(path.relative(filePath, fs.realpathSync(resolveScriptPath(pathAlias[name]))))
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

export function resolveScriptPath (p: string): string {
  const realPath = p
  const taroEnv = process.env.TARO_ENV
  const SCRIPT_EXT = JS_EXT.concat(TS_EXT)
  for (let i = 0; i < SCRIPT_EXT.length; i++) {
    const item = SCRIPT_EXT[i]
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

export function buildUsingComponents (
  filePath: string,
  sourceDir: string,
  pathAlias: IOption,
  components: IComponentObj[],
  isComponent?: boolean
): IOption {
  const usingComponents = Object.create(null)
  for (const component of components) {
    let componentPath = component.path
    if (isAliasPath(componentPath as string, pathAlias)) {
      componentPath = replaceAliasPath(filePath, componentPath as string, pathAlias)
    }
    componentPath = resolveScriptPath(path.resolve(filePath, '..', componentPath as string))
    if (fs.existsSync(componentPath)) {
      if (NODE_MODULES_REG.test(componentPath) && !NODE_MODULES_REG.test(filePath)) {
        componentPath = componentPath.replace(NODE_MODULES_REG, path.join(sourceDir, 'npm'))
      }
      componentPath = promoteRelativePath(path.relative(filePath, componentPath))
    } else {
      componentPath = component.path
    }
    if (component.name) {
      const componentName = component.name.split('|')[0]
      usingComponents[componentName] = (componentPath as string).replace(path.extname(componentPath as string), '')
    }
  }
  return Object.assign({}, isComponent ? {component: true} : {usingComponents: {}}, components.length ? {
    usingComponents
  } : {})
}

const npmCached = {}

export function resolveNpmSync (pkgName: string, root): string | null {
  try {
    if (!npmCached[pkgName]) {
      return resolvePath.sync(pkgName, {basedir: root})
    }
    return npmCached[pkgName]
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      throw new Error(`包 ${pkgName} 未安装`)
    }
    return null
  }
}

export function recursiveMerge (src, ...args) {
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
    return resolvePath.sync(`${pkgName}/package.json`, {basedir})
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

export function npmCodeHack (filePath: string, content: string, buildAdapter: BUILD_TYPES): string {
  // 修正core-js目录 _global.js
  // 修正所有用到过lodash的第三方包
  // 注：@tarojs/taro-alipay/dist/index.js,@tarojs/taro/dist/index.esm.js里面也有lodash相关的代码
  content = content && content.replace(/(\|\||:)\s*Function\(['"]return this['"]\)\(\)/g, function (match, first, second) {
    return `${first} ${GLOBAL_PROPS}`
  })

  const basename = path.basename(filePath)
  switch (basename) {
    case 'mobx.js':
      // 解决支付宝小程序全局window或global不存在的问题
      content = content.replace(
        /typeof window\s{0,}!==\s{0,}['"]undefined['"]\s{0,}\?\s{0,}window\s{0,}:\s{0,}global/,
        'typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}'
      )
      break
    case '_html.js':
      content = 'module.exports = false;'
      break
    case '_microtask.js':
      content = content.replace('if(Observer)', 'if(false && Observer)')
      // IOS 1.10.2 Promise BUG
      content = content.replace('Promise && Promise.resolve', 'false && Promise && Promise.resolve')
      break
  }
  if (buildAdapter === BUILD_TYPES.ALIPAY && content.replace(/\s\r\n/g, '').length <= 0) {
    content = '// Empty file'
  }
  return content
}

export function generateEnvList (env: object): object {
  const res = {}
  if (env && !isEmptyObject(env)) {
    for (const key in env) {
      try {
        res[`process.env.${key}`] = JSON.parse(env[key])
      } catch (err) {
        res[`process.env.${key}`] = env[key]
      }
    }
  }
  return res
}

export function generateConstantsList (constants: object): object {
  const res = {}
  if (constants && !isEmptyObject(constants)) {
    for (const key in constants) {
      if (isPlainObject(constants[key])) {
        res[key] = generateConstantsList(constants[key])
      } else {
        try {
          res[key] = JSON.parse(constants[key])
        } catch (err) {
          res[key] = constants[key]
        }
      }
    }
  }
  return res
}

export function resolveStylePath (p: string): string {
  const realPath = p
  const removeExtPath = p.replace(path.extname(p), '')
  const taroEnv = process.env.TARO_ENV
  for (let i = 0; i < CSS_EXT.length; i++) {
    const item = CSS_EXT[i]
    if (taroEnv) {
      if (fs.existsSync(`${removeExtPath}.${taroEnv}${item}`)) {
        return `${removeExtPath}.${taroEnv}${item}`
      }
    }
    if (fs.existsSync(`${p}${item}`)) {
      return `${p}${item}`
    }
  }
  return realPath
}
