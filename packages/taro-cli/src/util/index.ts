import * as fs from 'fs-extra'
import * as path from 'path'
import * as crypto from 'crypto'
import * as os from 'os'
import * as child_process from 'child_process'
import * as chalk from 'chalk'
import * as _ from 'lodash'

import {
  TS_EXT,
  JS_EXT,
  CSS_EXT,
  CSS_IMPORT_REG,
  processTypeMap,
  processTypeEnum,
  MINI_APP_FILES,
  BUILD_TYPES
} from './constants'

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
    return promoteRelativePath(path.relative(filePath, fs.realpathSync(pathAlias[name])))
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

export const homedir = (function () {
  let homedir: any
  const env: NodeJS.ProcessEnv = process.env
  const home = env.HOME
  const user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME
  if (process.platform === 'win32') {
    homedir = env.USERPROFILE || (env.HOMEDRIVE as string) + (env.HOMEPATH as string) || home || null
  } else if (process.platform === 'darwin') {
    homedir = home || (user ? `/Users/${user}` : null)
  } else if (process.platform === 'linux') {
    homedir = home || (process.getuid() === 0 ? '/root' : (user ? `/home/${user}` : null))
  }
  return typeof os.homedir === 'function' ? os.homedir : function () {
    return homedir
  }
})()

export function getRootPath (): string {
  return path.resolve(__dirname, '../../')
}

export function getTaroPath (): string {
  const taroPath = path.join(homedir(), '.taro')
  if (!fs.existsSync(taroPath)) {
    fs.mkdirSync(taroPath)
  }
  return taroPath
}

export function setConfig (config: object): void {
  const taroPath = getTaroPath()
  if (typeof config === 'object') {
    const oldConfig = getConfig()
    config = Object.assign({}, oldConfig, config)
    fs.writeFileSync(path.join(taroPath, 'config.json'), JSON.stringify(config, null, 2))
  }
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
  const SCRIPT_EXT = JS_EXT.concat(TS_EXT)
  for (let i = 0; i < SCRIPT_EXT.length; i++) {
    const item = SCRIPT_EXT[i]
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
  for (let i = 0; i < CSS_EXT.length; i++) {
    const item = CSS_EXT[i]
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
      try {
        res[key] = JSON.parse(constants[key])
      } catch (err) {
        res[key] = constants[key]
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
      if (processFn && typeof processFn === 'function') {
        return processFn(m, $2)
      }
      return ''
    }
    if (processFn && typeof processFn === 'function') {
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
  = (str: string): string => str.charAt(0).toUpperCase() + _.camelCase(str.substr(1))

export function getInstalledNpmPkgVersion (pkgName: string, basedir: string): string | null {
  const resolvePath = require('resolve')
  try {
    const pkg = resolvePath.sync(`${pkgName}/package.json`, { basedir })
    const pkgJson = fs.readJSONSync(pkg)
    return pkgJson.version
  } catch (err) {
    return null
  }
}
