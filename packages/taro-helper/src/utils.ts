import * as fs from 'fs-extra'
import * as path from 'path'
import * as os from 'os'
import * as child_process from 'child_process'
import * as chalk from 'chalk'
import { isPlainObject, camelCase, mergeWith, flatMap } from 'lodash'
import {
  processTypeEnum,
  processTypeMap,
  TARO_CONFIG_FLODER,
  SCRIPT_EXT,
  NODE_MODULES_REG,
  PLATFORMS,
  CSS_IMPORT_REG,
  CSS_EXT,
  REG_SCRIPTS
} from './constants'
import createBabelRegister from './babelRegister'

const execSync = child_process.execSync

export function normalizePath (path: string) {
  return path.replace(/\\/g, '/').replace(/\/{2,}/g, '/')
}

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

export function isAliasPath (name: string, pathAlias: Record<string, any> = {}): boolean {
  const prefixs = Object.keys(pathAlias)
  if (prefixs.length === 0) {
    return false
  }
  return prefixs.includes(name) || (new RegExp(`^(${prefixs.join('|')})/`).test(name))
}

export function replaceAliasPath (filePath: string, name: string, pathAlias: Record<string, any> = {}) {
  // 后续的 path.join 在遇到符号链接时将会解析为真实路径，如果
  // 这里的 filePath 没有做同样的处理，可能会导致 import 指向
  // 源代码文件，导致文件被意外修改
  filePath = fs.realpathSync(filePath)

  const prefixs = Object.keys(pathAlias)
  if (prefixs.includes(name)) {
    return promoteRelativePath(path.relative(filePath, fs.realpathSync(resolveScriptPath(pathAlias[name]))))
  }
  const reg = new RegExp(`^(${prefixs.join('|')})/(.*)`)
  name = name.replace(reg, function (_m, $1, $2) {
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
  return normalizePath(fPath)
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

export function recursiveFindNodeModules (filePath: string, lastFindPath?: string): string {
  const findWorkspaceRoot = require('find-yarn-workspace-root')
  if (lastFindPath && (normalizePath(filePath) === normalizePath(lastFindPath))) {
    return filePath
  }
  const dirname = path.dirname(filePath)
  const workspaceRoot = findWorkspaceRoot(dirname)
  const nodeModules = path.join(workspaceRoot || dirname, 'node_modules')
  if (fs.existsSync(nodeModules)) {
    return nodeModules
  }
  if (dirname.split(path.sep).length <= 1) {
    printLog(processTypeEnum.ERROR, `在${dirname}目录下`, '未找到node_modules文件夹，请先安装相关依赖库！')
    return nodeModules
  }
  return recursiveFindNodeModules(dirname, filePath)
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

export function getTaroPath (): string {
  const taroPath = path.join(getUserHomeDir(), TARO_CONFIG_FLODER)
  if (!fs.existsSync(taroPath)) {
    fs.ensureDirSync(taroPath)
  }
  return taroPath
}

export function getConfig (): Record<string, any> {
  const configPath = path.join(getTaroPath(), 'config.json')
  if (fs.existsSync(configPath)) {
    return require(configPath)
  }
  return {}
}

export function getSystemUsername (): string {
  const userHome = getUserHomeDir()
  const systemUsername = process.env.USER || path.basename(userHome)
  return systemUsername
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

export function resolveScriptPath (p: string): string {
  return resolveMainFilePath(p)
}

export function generateEnvList (env: Record<string, any>): Record<string, any> {
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

export function generateConstantsList (constants: Record<string, any>): Record<string, any> {
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

export const pascalCase: (str: string) => string =
  (str: string): string => str.charAt(0).toUpperCase() + camelCase(str.substr(1))

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

export const recursiveMerge = <T = any>(src: Partial<T>, ...args: (Partial<T> | undefined)[]) => {
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
  const Transform = require('stream').Transform
  const yauzl = require('yauzl')

  return new Promise<void>((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
      if (err || !zipfile) throw err
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
            if (err || !readStream) throw err
            const filter = new Transform()
            filter._transform = function (chunk, _encoding, cb) {
              cb(undefined, chunk)
            }
            filter._flush = function (cb) {
              cb()
              zipfile.readEntry()
            }
            const fileNameArr = normalizePath(entry.fileName).split('/')
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

export interface FileStat {
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

export function addPlatforms (platform: string) {
  const upperPlatform = platform.toLocaleUpperCase()
  if (PLATFORMS[upperPlatform]) return
  PLATFORMS[upperPlatform] = platform
}

export const getModuleDefaultExport = exports => exports.__esModule ? exports.default : exports

export function removeHeadSlash (str: string) {
  return str.replace(/^(\/|\\)/, '')
}

function analyzeImport (filePath: string): string[] {
  const parser = require('@babel/parser')
  const traverse = require('@babel/traverse').default
  const code = fs.readFileSync(filePath).toString()
  let importPaths: string[] = []
  filePath = path.dirname(filePath)

  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: [
      'typescript',
      'classProperties',
      'objectRestSpread',
      'optionalChaining'
    ]
  })

  traverse(ast, {
    ImportDeclaration ({ node }) {
      const list: string[] = []
      const source = node.source.value

      if (path.extname(source)) {
        const importPath = path.resolve(filePath, source)
        list.push(importPath)
      } else {
        ['.js', '.ts', '.json'].forEach(ext => {
          const importPath = path.resolve(filePath, source + ext)
          list.push(importPath)
        })
      }

      const dep = list.find(importPath => fs.existsSync(importPath))
      if (!dep) return

      importPaths.push(dep)
      importPaths = importPaths.concat(analyzeImport(dep))
    }
  })
  return importPaths
}

// converts ast nodes to js object
function exprToObject (node: any) {
  const types = ['BooleanLiteral', 'StringLiteral', 'NumericLiteral']

  if (types.includes(node.type)) {
    return node.value
  }

  if (node.name === 'undefined' && !node.value) {
    return undefined
  }

  if (node.type === 'NullLiteral') {
    return null
  }

  if (node.type === 'ObjectExpression') {
    return genProps(node.properties)
  }

  if (node.type === 'ArrayExpression') {
    return node.elements.reduce((acc: any, el: any) => [
      ...acc,
      ...(
        el!.type === 'SpreadElement'
          ? exprToObject(el.argument)
          : [exprToObject(el)]
      )
    ], [])
  }
}

// converts ObjectExpressions to js object
function genProps (props: any[]) {
  return props.reduce((acc, prop) => {
    if (prop.type === 'SpreadElement') {
      return {
        ...acc,
        ...exprToObject(prop.argument)
      }
    } else if (prop.type !== 'ObjectMethod') {
      const v = exprToObject(prop.value)
      if (v !== undefined) {
        return {
          ...acc,
          [prop.key.name || prop.key.value]: v
        }
      }
    }
    return acc
  }, {})
}

// read page config from a sfc file instead of the regular config file
function readSFCPageConfig (configPath: string) {
  if (!fs.existsSync(configPath)) return {}

  const sfcSource = fs.readFileSync(configPath, 'utf8')
  const dpcReg = /definePageConfig\(\{[\w\W]+?\}\)/g
  const matches = sfcSource.match(dpcReg)

  let result: any = {}

  if (matches && matches.length === 1) {
    const callExprHandler = (p: any) => {
      const { callee } = p.node
      if (!callee.name) return
      if (callee.name && callee.name !== 'definePageConfig') return

      const configNode = p.node.arguments[0]
      result = exprToObject(configNode)
      p.stop()
    }

    const configSource = matches[0]
    const babel = require('@babel/core')
    const ast = babel.parse(configSource, { filename: '' })

    babel.traverse(ast.program, { CallExpression: callExprHandler })
  }

  return result
}

export function readPageConfig (configPath: string) {
  let result: any = {}
  const extNames = ['.js', '.jsx', '.ts', '.tsx', '.vue']

  // check source file extension
  extNames.some(ext => {
    const tempPath = configPath.replace('.config', ext)
    if (fs.existsSync(tempPath)) {
      try {
        result = readSFCPageConfig(tempPath)
      } catch (error) {
        result = {}
      }
      return true
    }
  })
  return result
}

export function readConfig (configPath: string) {
  let result: any = {}
  if (fs.existsSync(configPath)) {
    const importPaths = REG_SCRIPTS.test(configPath) ? analyzeImport(configPath) : []

    createBabelRegister({
      only: [
        configPath,
        filepath => importPaths.includes(filepath)
      ]
    })

    importPaths.concat([configPath]).forEach(item => {
      delete require.cache[item]
    })

    result = getModuleDefaultExport(require(configPath))
  } else {
    result = readPageConfig(configPath)
  }
  return result
}
