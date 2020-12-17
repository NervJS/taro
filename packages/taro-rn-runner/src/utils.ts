import * as fs from 'fs'
import * as path from 'path'
import helper from '@tarojs/helper'
import { getConfig, getRNConfig } from './config/config-holder'

export function isRegExp (string) {
  return string.startsWith('^') || string.endsWith('$')
}

export function isRelativePath (filePath) {
  return filePath.match(/^\.?\.\//)
}

function escapeRegExp (string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getAliasTarget (key, isKeyRegExp) {
  const regExpPattern = isKeyRegExp ? key : `^${escapeRegExp(key)}(/.*|)$`
  return new RegExp(regExpPattern)
}

function getAlias () {
  const config = getConfig()
  const rnconfig = getRNConfig()
  let alias = {}
  if (rnconfig.alias) {
    alias = rnconfig.alias
  }
  if (config.alias) {
    alias = config.alias
  }
  alias['@tarojs/components'] = '@tarojs/components-rn'
  alias['@tarojs/taro'] = '@tarojs/taro-rn'
  return alias
}

// [ [/xyz$/, '/abc/path/to/file.js'], ['xyz', '/abc/path/to/file.js'] ]
function normalizeAlias () {
  const alias = getAlias()
  const aliasKeys = Object.keys(alias)
  return aliasKeys.map(key => {
    const isKeyRegExp = isRegExp(key)
    return [getAliasTarget(key, isKeyRegExp), alias[key]]
  })
}

const aliasPairs = normalizeAlias()

// Refrence https://webpack.js.org/configuration/resolve/#resolvealias
export function resolvePathFromAlias (moduleName) {
  // TODO: [string] values are supported since webpack 5.
  // alias: { _: [path.resolve(__dirname, 'src/utilities/'), path.resolve(__dirname, 'src/templates/')] }
  let newModuleName = moduleName
  aliasPairs.find(([regExp, aliasValue]) => {
    const execResult = regExp.exec(moduleName)

    if (execResult === null) {
      return false
    }
    const [, restPath] = execResult
    let modulePath = aliasValue
    if (isRelativePath(aliasValue)) {
      modulePath = path.resolve(process.cwd(), aliasValue)
    }
    newModuleName = path.join(modulePath, restPath) // fix window path
    return true
  })
  return newModuleName
}

const extensions = ([] as string[]).concat(helper.JS_EXT, helper.TS_EXT, helper.CSS_EXT)
const omitExtensions = ([] as string[]).concat(helper.JS_EXT, helper.TS_EXT)

// lookup modulePath if the file path exist
// import './a.scss'; import './app'; import '/app'; import 'app'; import 'C:\\\\app';
export function lookup (modulePath, platform, isDirectory = false) {
  const ext = path.extname(modulePath).toLowerCase()
  const extMatched = !!extensions.find(e => e === ext)
  // when platformExt is empty string('') it means find modulePath itself
  const platformExts = [`.${platform}`, '.rn', '']
  // include ext
  if (extMatched) {
    for (const plat of platformExts) {
      const platformModulePath = modulePath.replace(ext, `${plat}${ext}`)
      if (fs.existsSync(platformModulePath)) {
        return platformModulePath
      }
    }
  }
  // handle some omit situations
  for (const plat of platformExts) {
    for (const omitExt of omitExtensions) {
      const platformModulePath = `${modulePath}${plat}${omitExt}`
      if (fs.existsSync(platformModulePath)) {
        return platformModulePath
      }
    }
  }
  // it is lookup in directory and the file path not exists, then return origin module path
  if (isDirectory) {
    return path.dirname(modulePath) // modulePath.replace(/\/index$/, '')
  }
  // handle the directory index file
  const moduleIndexPath = path.join(modulePath, 'index')
  return lookup(moduleIndexPath, platform, true)
}
