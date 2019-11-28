import * as path from 'path'
import * as fs from 'fs-extra'
import * as t from 'babel-types'
import * as spawn from 'cross-spawn'
import * as resolvePath from 'resolve'
import * as child_process from 'child_process'

import chalk from 'chalk'
import { mergeWith } from 'lodash'
import { IOption, IComponentObj, IInstallOptions } from './types'

import {
  CONFIG_MAP,
  JS_EXT,
  TS_EXT,
  NODE_MODULES_REG,
  processTypeMap,
  processTypeEnum
} from './constants'

const npmCached = {}
const erroneous: string[] = []
const execSync = child_process.execSync
const PEERS = /UNMET PEER DEPENDENCY ([a-z\-0-9.]+)@(.+)/gm

const defaultInstallOptions: IInstallOptions = {
  dev: false,
  peerDependencies: true
}

export const isNodeModule = (filename: string) => NODE_MODULES_REG.test(filename)
export const taroPluginPrefix = '@tarojs/plugin-'

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
      usingComponents[component.name] = (componentPath as string).replace(path.extname(componentPath as string), '')
    }
  }
  return Object.assign({}, isComponent ? { component: true } : { usingComponents: {} }, components.length ? {
    usingComponents
  } : {})
}

export function resolveNpmSync (pluginName: string, root): string {
  try {
    if (!npmCached[pluginName]) {
      const res = resolvePath.sync(pluginName, { basedir: root })
      return res
    }
    return npmCached[pluginName]
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.log(chalk.cyan(`缺少npm包${pluginName}，开始安装...`))
      const installOptions: IInstallOptions = {
        dev: false
      }
      if (pluginName.indexOf(taroPluginPrefix) >= 0) {
        installOptions.dev = true
      }
      installNpmPkg(pluginName, installOptions)
      return resolveNpmSync(pluginName, root)
    }
    return ''
  }
}

export function installNpmPkg (pkgList: string[] | string, options: IInstallOptions) {
  if (!pkgList) {
    return
  }
  if (!Array.isArray(pkgList)) {
    pkgList = [pkgList]
  }
  pkgList = pkgList.filter(dep => {
    return erroneous.indexOf(dep) === -1
  })

  if (!pkgList.length) {
    return
  }
  options = Object.assign({}, defaultInstallOptions, options)
  let installer = ''
  let args: string[] = []

  if (shouldUseYarn()) {
    installer = 'yarn'
  } else if (shouldUseCnpm()) {
    installer = 'cnpm'
  } else {
    installer = 'npm'
  }

  if (shouldUseYarn()) {
    args = ['add'].concat(pkgList).filter(Boolean)
    args.push('--silent', '--no-progress')
    if (options.dev) {
      args.push('-D')
    }
  } else {
    args = ['install'].concat(pkgList).filter(Boolean)
    args.push('--silent', '--no-progress')
    if (options.dev) {
      args.push('--save-dev')
    } else {
      args.push('--save')
    }
  }
  const output = spawn.sync(installer, args, {
    stdio: ['ignore', 'pipe', 'inherit']
  })
  if (output.status) {
    pkgList.forEach(dep => {
      erroneous.push(dep)
    })
  }
  let matches: RegExpExecArray | null = null
  const peers: string[] = []

  while ((matches = PEERS.exec(output.stdout))) {
    const pkg = matches[1]
    const version = matches[2]
    if (version.match(' ')) {
      peers.push(pkg)
    } else {
      peers.push(`${pkg}@${version}`)
    }
  }
  if (options.peerDependencies && peers.length) {
    console.info('正在安装 peerDependencies...')
    installNpmPkg(peers, options)
  }
  return output
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
