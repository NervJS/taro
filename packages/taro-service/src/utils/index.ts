import * as path from 'path'

import { merge } from 'lodash'
import * as resolve from 'resolve'
import { getModuleDefaultExport, NODE_MODULES_REG, isNpmPkg } from '@tarojs/helper'

import { PluginItem } from '@tarojs/taro/types/compile'

import { PluginType } from './constants'
import { IPlugin } from './types'

export function getPluginPath (pluginPath: string) {
  if (isNpmPkg(pluginPath) || path.isAbsolute(pluginPath)) return pluginPath
  throw new Error('plugin 和 preset 配置必须为绝对路径或者包名')
}

export function convertPluginsToObject (items: PluginItem[]) {
  return () => {
    const obj = {}
    if (Array.isArray(items)) {
      items.forEach(item => {
        if (typeof item === 'string') {
          const name = getPluginPath(item)
          obj[name] = null
        } else if (Array.isArray(item)) {
          const name = getPluginPath(item[0])
          obj[name] = item[1]
        }
      })
    }
    return obj
  }
}

export function mergePlugins (dist: PluginItem[], src: PluginItem[]) {
  return () => {
    const srcObj = convertPluginsToObject(src)()
    const distObj = convertPluginsToObject(dist)()
    return merge(srcObj, distObj)
  }
}

// getModuleDefaultExport
export function resolvePresetsOrPlugins (root: string, args, type: PluginType): IPlugin[] {
  return Object.keys(args).map(item => {
    let pkgInfo
    const fPath = resolve.sync(item, {
      basedir: root,
      extensions: ['.js', '.ts'],
      packageFilter (pkg) {
        pkgInfo = pkg
      }
    })
    let name = fPath
    if (NODE_MODULES_REG.test(fPath) && isNpmPkg(item)) {
      name = pkgInfo.name || fPath
    }
    return {
      id: fPath,
      path: fPath,
      name,
      type,
      opts: args[item] || {},
      apply () {
        try {
          return getModuleDefaultExport(require(fPath))
        } catch (err) {
          throw err
        }
      }
    }
  })
}

function supplementBlank (length) {
  return Array(length).map(() => '').join(' ')
}

export function printHelpLog (command, optionsList: Map<string, string>, synopsisList?: Set<string>) {
  console.log(`Usage: taro ${command} [options]`)
  console.log()
  console.log('Options:')
  const keys = Array.from(optionsList.keys())
  const maxLength = keys.reduce((v1, v2) => {
    return v1.length > v2.length ? v1 : v2
  }).length + 3
  optionsList.forEach((v, k) => {
    const supplementBlankLength = maxLength - k.length
    console.log(`  ${k}${supplementBlank(supplementBlankLength)}${v}`)
  })
  if (synopsisList && synopsisList.size) {
    console.log()
    console.log('Synopsis:')
    synopsisList.forEach(item => {
      console.log(`  $ ${item}`)
    })
  }
}
