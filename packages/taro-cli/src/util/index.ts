import * as fs from 'fs-extra'
import * as path from 'path'
import * as crypto from 'crypto'
import * as os from 'os'
import * as child_process from 'child_process'
import * as chalk from 'chalk'
import { mergeWith, isPlainObject, camelCase, flatMap } from 'lodash'
import * as minimatch from 'minimatch'
import * as t from 'babel-types'
import * as yauzl from 'yauzl'
import { Transform } from 'stream'

import defaultBabelConfig from '../config/babel'
import defaultUglifyConfig from '../config/uglify'

import {
  JS_EXT,
  TS_EXT,
  CSS_EXT,
  CSS_IMPORT_REG,
  processTypeMap,
  processTypeEnum,
  MINI_APP_FILES,
  BUILD_TYPES,
  CONFIG_MAP,
  REG_STYLE
} from './constants'
import { ICopyArgOptions, ICopyOptions, TogglableOptions } from './types'
import { callPluginSync } from './npm'

const execSync = child_process.execSync

export function isNpmPkg (name: string): boolean {
  if (/^(\.|\/)/.test(name)) {
    return false
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

export const homedir = os.homedir

export function getRootPath (): string {
  return path.resolve(__dirname, '../../')
}

export function getTaroPath (): string {
  const taroPath = path.join(homedir(), '.taro')
  if (!fs.existsSync(taroPath)) {
    fs.ensureDirSync(taroPath)
  }
  return taroPath
}

export function getConfig (): object {
  const configPath = path.join(getTaroPath(), 'config.json')
  if (fs.existsSync(configPath)) {
    return require(configPath)
  }
  return {}
}

export function getSystemUsername (): string {
  const userHome = homedir()
  const systemUsername = process.env.USER || path.basename(userHome)
  return systemUsername
}

export function getPkgVersion (): string {
  return require(path.join(getRootPath(), 'package.json')).version
}

export function getPkgItemByKey (key: string) {
  const packageMap = require(path.join(getRootPath(), 'package.json'))
  if (Object.keys(packageMap).indexOf(key) === -1) {
    return {}
  } else {
    return packageMap[key]
  }
}

export function printPkgVersion () {
  const taroVersion = getPkgVersion()
  console.log(`👽 Taro v${taroVersion}`)
  console.log()
}

export function shouldUseYarn (): boolean {
  try {
    execSync('yarn --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

export function shouldUseCnpm (): boolean {
  try {
    execSync('cnpm --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
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

export function urlJoin (...agrs: string[]): string {
  function normalize (str) {
    return str
      .replace(/([/]+)/g, '/')
      .replace(/\/\?(?!\?)/g, '?')
      .replace(/\/#/g, '#')
      .replace(/:\//g, '://')
  }

  const joined = [].slice.call(agrs, 0).join('/')
  return normalize(joined)
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

export function isDifferentArray (a: any[], b: any[]): boolean {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return true
  }
  if (a.length !== b.length) {
    return true
  }
  a = a.sort()
  b = b.sort()
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return true
    }
  }
  return false
}

export function checksum (buf: Buffer | string, length?): string {
  if (!Buffer.isBuffer(buf)) {
    buf = Buffer.from(buf)
  }
  return crypto.createHash('md5').update(buf).digest('hex').slice(0, length || 8)
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

export function replaceContentEnv (content: string, env: object): string {
  if (env && !isEmptyObject(env)) {
    for (const key in env) {
      const reg = new RegExp(`process.env.${key}`, 'g')
      content = content.replace(reg, env[key])
    }
    return content
  }
  return content
}

export function generateEnvList (env: object): object {
  const res = { }
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

export function replaceContentConstants (content: string, constants: object): string {
  if (constants && !isEmptyObject(constants)) {
    for (const key in constants) {
      const reg = new RegExp(key, 'g')
      content = content.replace(reg, constants[key])
    }
    return content
  }
  return content
}

export function generateConstantsList (constants: object): object {
  const res = { }
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

export function cssImports (content: string): string[] {
  let match: RegExpExecArray | null
  const results: string[] = []
  content = String(content).replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '')
  while ((match = CSS_IMPORT_REG.exec(content))) {
    results.push(match[2])
  }
  return results
}

export function processStyleImports (content: string, adapter: BUILD_TYPES, processFn: (a: string, b: string) => string) {
  const style: string[] = []
  const imports: string[] = []
  const styleReg = new RegExp(`\\${MINI_APP_FILES[adapter].STYLE}`)
  content = content.replace(CSS_IMPORT_REG, (m, $1, $2) => {
    if (styleReg.test($2)) {
      style.push(m)
      imports.push($2)
      if (processFn) {
        return processFn(m, $2)
      }
      return ''
    }
    if (processFn) {
      return processFn(m, $2)
    }
    return m
  })
  return {
    content,
    style,
    imports
  }
}
/*eslint-disable*/
const retries = (process.platform === 'win32') ? 100 : 1
export function emptyDirectory (dirPath: string, opts: { excludes: string[] } = { excludes: [] }) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(file => {
      const curPath = path.join(dirPath, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        let removed = false
        let i = 0 // retry counter
        do {
          try {
            if (!opts.excludes.length || !opts.excludes.some(item => curPath.indexOf(item) >= 0)) {
              emptyDirectory(curPath)
              fs.rmdirSync(curPath)
            }
            removed = true
          } catch (e) {
          } finally {
            if (++i < retries) {
              continue
            }
          }
        } while (!removed)
      } else {
        fs.unlinkSync(curPath)
      }
    })
  }
}
/* eslint-enable */

export function recursiveFindNodeModules (filePath: string): string {
  const dirname = path.dirname(filePath)
  const nodeModules = path.join(dirname, 'node_modules')
  if (fs.existsSync(nodeModules)) {
    return nodeModules
  }
  return recursiveFindNodeModules(dirname)
}

export const pascalCase: (str: string) => string
  = (str: string): string => str.charAt(0).toUpperCase() + camelCase(str.substr(1))

export function getInstalledNpmPkgPath (pkgName: string, basedir: string): string | null {
  const resolvePath = require('resolve')
  try {
    return resolvePath.sync(`${pkgName}/package.json`, { basedir })
  } catch (err) {
    return null
  }
}

export function getInstalledNpmPkgVersion (pkgName: string, basedir: string): string | null {
  const pkgPath = getInstalledNpmPkgPath(pkgName, basedir)
  if (!pkgPath) {
    return null
  }
  return fs.readJSONSync(pkgPath).version
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
    const obj= {}
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

export function copyFileSync (from: string, to: string, options?: ICopyArgOptions) {
  const filename = path.basename(from)
  if (fs.statSync(from).isFile() && !path.extname(to)) {
    fs.ensureDirSync(to)
    if (from === path.join(to, filename)) {
      return
    }
    return fs.copySync(from, path.join(to, filename), options)
  }
  if (from === to) {
    return
  }
  fs.ensureDirSync(path.dirname(to))
  return fs.copySync(from, to, options)
}

export function copyFiles (appPath: string, copyConfig: ICopyOptions | void) {
  copyConfig = copyConfig || { patterns: [], options: {} }
  if (copyConfig.patterns && copyConfig.patterns.length) {
    copyConfig.options = copyConfig.options || {}
    const globalIgnore = copyConfig.options.ignore
    const projectDir = appPath
    copyConfig.patterns.forEach(pattern => {
      if (pattern.from && pattern.to) {
        const from = path.join(projectDir, pattern.from)
        const to = path.join(projectDir, pattern.to)
        let ignore = pattern.ignore || globalIgnore
        if (fs.existsSync(from)) {
          const copyOptions: ICopyArgOptions = {}
          if (ignore) {
            ignore = Array.isArray(ignore) ? ignore : [ignore]
            copyOptions.filter = src => {
              let isMatch = false
              ignore && ignore.forEach(iPa => {
                if (minimatch(path.basename(src), iPa)) {
                  isMatch = true
                }
              })
              return !isMatch
            }
          }
          copyFileSync(from, to, copyOptions)
        } else {
          printLog(processTypeEnum.ERROR, '拷贝失败', `${pattern.from} 文件不存在！`)
        }
      }
    })
  }
}

export function isQuickappPkg (name: string, quickappPkgs: any[] = []): boolean {
  if (!quickappPkgs.length) {
    return /@system\./.test(name)
  }
  let isQuickappPkg = false
  quickappPkgs.forEach(item => {
    if (item.name === name.replace(/^@/, '')) {
      isQuickappPkg = true
    }
  })
  return isQuickappPkg
}

export function generateQuickAppUx ({
  script,
  template,
  style,
  imports
}: {
  script?: string,
  template?: string,
  style?: string,
  imports?: Set<{
    path: string,
    name: string
  }>
}) {
  let uxTxt = ''
  if (imports && imports.size) {
    imports.forEach(item => {
      uxTxt += `<import src='${item.path}' name='${item.name}'></import>\n`
    })
  }
  if (style) {
    if (REG_STYLE.test(style)) {
      uxTxt += `<style src="${style}"></style>\n`
    } else {
      uxTxt += `<style>\n${style}\n</style>\n`
    }
  }
  if (template) {
    uxTxt += `<template>\n${template}\n</template>\n`
  }
  if (script) {
    uxTxt += `<script>\n${script}\n</script>\n`
  }
  return uxTxt
}

export const recursiveMerge = (src, ...args) => {
  return mergeWith(src, ...args, (value, srcValue, key, obj, source) => {
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

export const mergeVisitors = (src, ...args) => {
  const validFuncs = ['exit', 'enter']
  return mergeWith(src, ...args, (value, srcValue, key, object, srcObject) => {
    if (!object.hasOwnProperty(key) || !srcObject.hasOwnProperty(key)) {
      return undefined
    }

    const shouldMergeToArray = validFuncs.indexOf(key) > -1
    if (shouldMergeToArray) {
      return flatMap([value, srcValue])
    }
    const [newValue, newSrcValue] = [value, srcValue].map(v => {
      if (typeof v === 'function') {
        return {
          enter: v
        }
      } else {
        return v
      }
    })
    return mergeVisitors(newValue, newSrcValue)
  })
}

export const applyArrayedVisitors = obj => {
  let key
  for (key in obj) {
    const funcs = obj[key]
    if (Array.isArray(funcs)) {
      obj[key] = (astPath, ...args) => {
        funcs.forEach(func => {
          func(astPath, ...args)
        })
      }
    } else if (typeof funcs === 'object') {
      applyArrayedVisitors(funcs)
    }
  }
  return obj
}

export function unzip (zipPath) {
  return new Promise((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) throw err
      zipfile.on('close', () => {
        fs.removeSync(zipPath)
        resolve()
      })
      zipfile.readEntry()
      zipfile.on('error', (err) => {
        reject(err)
      })
      zipfile.on('entry', entry => {
        if (/\/$/.test(entry.fileName)) {
          const fileNameArr = entry.fileName.replace(/\\/g, '/').split('/')
          fileNameArr.shift()
          const fileName = fileNameArr.join('/')
          fs.ensureDirSync(path.join(path.dirname(zipPath), fileName))
          zipfile.readEntry()
        } else {
          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) throw err
            const filter = new Transform()
            filter._transform = function (chunk, encoding, cb) {
              cb(undefined, chunk)
            }
            filter._flush = function (cb) {
              cb()
              zipfile.readEntry()
            }
            const fileNameArr = entry.fileName.replace(/\\/g, '/').split('/')
            fileNameArr.shift()
            const fileName = fileNameArr.join('/')
            const writeStream = fs.createWriteStream(path.join(path.dirname(zipPath), fileName))
            writeStream.on('close', () => {})
            readStream
              .pipe(filter)
              .pipe(writeStream)
          })
        }
      })
    })
  })
}

let babelConfig

export function getBabelConfig (babel) {
  if (!babelConfig) {
    babelConfig = mergeWith({}, defaultBabelConfig, babel, (objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return Array.from(new Set(srcValue.concat(objValue)))
      }
    })
  }
  return babelConfig
}

export function uglifyJS (resCode: string, filePath: string, root: string, uglify: TogglableOptions): string {
  const uglifyPluginConfig = uglify || { enable: true }
  if (uglifyPluginConfig.enable) {
    const uglifyConfig = Object.assign(defaultUglifyConfig, uglifyPluginConfig.config || {})
    const uglifyResult = callPluginSync('uglifyjs', resCode, filePath, uglifyConfig, root)
    if (uglifyResult.error) {
      printLog(processTypeEnum.ERROR, '压缩错误', `文件${filePath}`)
      console.log(uglifyResult.error)
      return resCode
    }
    return uglifyResult.code
  }
  return resCode
}
