import * as fs from 'fs-extra'
import * as path from 'path'
import { Transform } from 'stream'
import * as os from 'os'
import * as child_process from 'child_process'

import chalk from 'chalk'
import { mergeWith, isPlainObject, camelCase, flatMap } from 'lodash'
import * as yauzl from 'yauzl'
import * as findWorkspaceRoot from 'find-yarn-workspace-root'

import defaultBabelConfig from '../config/babel'

import {
  JS_EXT,
  TS_EXT,
  CSS_EXT,
  CSS_IMPORT_REG,
  processTypeMap,
  processTypeEnum,
  MINI_APP_FILES,
  NODE_MODULES,
  BUILD_TYPES,
  TARO_CONFIG_FLODER
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
  const taroPath = path.join(homedir(), TARO_CONFIG_FLODER)
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
    execSync('yarn --version', {stdio: 'ignore'})
    return true
  } catch (e) {
    return false
  }
}

export function shouldUseCnpm (): boolean {
  try {
    execSync('cnpm --version', {stdio: 'ignore'})
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

export function emptyDirectory (dirPath: string, opts: { excludes: string[] } = {excludes: []}) {
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
  const workspaceRoot = findWorkspaceRoot(dirname)
  const nodeModules = path.join(workspaceRoot || dirname, 'node_modules')
  if (fs.existsSync(nodeModules)) {
    return nodeModules
  }
  if (dirname.split(path.sep).length <= 1) {
    printLog(processTypeEnum.ERROR, `在${dirname}目录下`, `未找到node_modules文件夹，请先安装相关依赖库！`)
    return nodeModules
  }
  return recursiveFindNodeModules(dirname)
}

export const pascalCase: (str: string) => string
  = (str: string): string => str.charAt(0).toUpperCase() + camelCase(str.substr(1))

export function getInstalledNpmPkgPath (pkgName: string, basedir: string): string | null {
  const resolvePath = require('resolve')
  try {
    return resolvePath.sync(`${pkgName}/package.json`, {basedir})
  } catch (err) {
    return null
  }
}

export async function checkCliAndFrameworkVersion (appPath, buildAdapter) {
  const pkgVersion = getPkgVersion()
  const frameworkName = `@tarojs/taro-${buildAdapter}`
  const nodeModulesPath = recursiveFindNodeModules(path.join(appPath, NODE_MODULES))
  const frameworkVersion = getInstalledNpmPkgVersion(frameworkName, nodeModulesPath)
  if (frameworkVersion) {
    if (frameworkVersion !== pkgVersion) {
      const taroCliPath = path.join(getRootPath(), 'package.json')
      const frameworkPath = path.join(nodeModulesPath, frameworkName, 'package.json')
      printLog(processTypeEnum.ERROR, '版本问题', `Taro CLI 与本地安装运行时框架 ${frameworkName} 版本不一致, 请确保版本一致！`)
      printLog(processTypeEnum.REMIND, '升级命令', `升级到最新CLI：taro update self   升级到最新依赖库：taro update project`)
      printLog(processTypeEnum.REMIND, '升级文档', `请参考 "常用 CLI 命令"中"更新" 章节：https://taro-docs.jd.com/taro/docs/GETTING-STARTED.html`)
      console.log(``)
      console.log(`Taro CLI：${getPkgVersion()}             路径：${taroCliPath}`)
      console.log(`${frameworkName}：${frameworkVersion}   路径：${frameworkPath}`)
      console.log(``)
      process.exit(1)
    }
  } else {
    printLog(processTypeEnum.WARNING, '依赖安装', chalk.red(`项目依赖 ${frameworkName} 未安装，或安装有误，请重新安装此依赖！`))
    process.exit(1)
  }
}

export function getInstalledNpmPkgVersion (pkgName: string, basedir: string): string | null {
  const pkgPath = getInstalledNpmPkgPath(pkgName, basedir)
  if (!pkgPath) {
    return null
  }
  return fs.readJSONSync(pkgPath).version
}

export function isQuickappPkg (name: string, quickappPkgs: any[] = []): boolean {
  const isQuickappPkg = /^@(system|service)\.[a-zA-Z]{1,}/.test(name)
  let hasSetInManifest = false
  quickappPkgs.forEach(item => {
    if (item.name === name.replace(/^@/, '')) {
      hasSetInManifest = true
    }
  })
  if (isQuickappPkg && !hasSetInManifest) {
    printLog(processTypeEnum.ERROR, '快应用', `需要在 ${chalk.bold('project.quickapp.json')} 文件的 ${chalk.bold('features')} 配置中添加 ${chalk.bold(name)}`)
  }
  return isQuickappPkg
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
    yauzl.open(zipPath, {lazyEntries: true}, (err, zipfile) => {
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

export const getAllFilesInFloder = async (
  floder: string,
  filter: string[] = []
): Promise<string[]> => {
  let files: string[] = []
  const list = readDirWithFileTypes(floder)

  await Promise.all(
    list.map(async item => {
      const itemPath = path.join(floder, item.name)
      if (item.isDirectory) {
        const _files = await getAllFilesInFloder(itemPath, filter)
        files = [...files, ..._files]
      } else if (item.isFile) {
        if (!filter.find(rule => rule === item.name)) files.push(itemPath)
      }
    })
  )

  return files
}

export function getUserHomeDir (): string {
  function homedir (): string {
    const env = process.env
    const home = env.HOME
    const user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME

    if (process.platform === 'win32') {
      return env.USERPROFILE || '' + env.HOMEDRIVE + env.HOMEPATH || home || ''
    }

    if (process.platform === 'darwin') {
      return home || (user ? '/Users/' + user : '')
    }

    if (process.platform === 'linux') {
      return home || (process.getuid() === 0 ? '/root' : (user ? '/home/' + user : ''))
    }

    return home || ''
  }

  return typeof (os.homedir as (() => string) | undefined) === 'function' ? os.homedir() : homedir()
}

export type TemplateSourceType = 'git' | 'url'

export function getTemplateSourceType (url: string): TemplateSourceType {
  if (/^github:/.test(url) || /^gitlab:/.test(url) || /^direct:/.test(url)) {
    return 'git'
  } else {
    return 'url'
  }
}

interface FileStat {
  name: string
  isDirectory: boolean
  isFile: boolean
}

export function readDirWithFileTypes (floder: string): FileStat[] {
  const list = fs.readdirSync(floder)
  const res = list.map(name => {
    const stat = fs.statSync(path.join(floder, name))
    return {
      name,
      isDirectory: stat.isDirectory(),
      isFile: stat.isFile()
    }
  })
  return res
}

export function extnameExpRegOf (filePath: string): RegExp {
  return new RegExp(`${path.extname(filePath)}$`)
}

export function generateAlipayPath (filePath) {
  return filePath.replace(/@/g, '_')
}

interface IRemindVersion {
  remindTimes: number
}

export function printVersionTip () {
  const taroPath = getTaroPath()
  let remindVersion: IRemindVersion = {remindTimes: 0}
  const remindVersionFilePath = path.join(taroPath, '.remind_version.json')
  if (!fs.existsSync(remindVersionFilePath)) {
    fs.ensureDirSync(taroPath)
    fs.writeFileSync(remindVersionFilePath, JSON.stringify(remindVersion))
  } else {
    remindVersion = fs.readJSONSync(remindVersionFilePath)
  }
  if (remindVersion.remindTimes < 5) {
    console.log(chalk.red('当前您正在使用 Taro 2.0 版本，请先执行 taro doctor 确保编译配置正确'))
    console.log(chalk.red('如出现令你束手无策的问题，请使用 taro update 命令更新到你指定的稳定版本'))
    remindVersion.remindTimes++
    fs.writeFileSync(remindVersionFilePath, JSON.stringify(remindVersion))
  }
}
