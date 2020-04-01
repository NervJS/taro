import * as path from 'path'

import { merge } from 'lodash'
import * as resolve from 'resolve'

import { PluginItem } from '@tarojs/taro/types/compile'

import { presetOrPluginPrefixReg, PluginType, PluginNamePrefix } from './constants'
import { IPlugin } from './types'

export const isNpmPkg: (name: string) => boolean = name => !(/^(\.|\/)/.test(name))

export function getPluginPath (pluginPath: string, type: PluginType) {
  if (isNpmPkg(pluginPath))
    return presetOrPluginPrefixReg.test(pluginPath) ? pluginPath : `${PluginNamePrefix[type]}${pluginPath}`
  if (path.isAbsolute(pluginPath)) return pluginPath
  throw new Error('plugin 和 preset 配置必须为绝对路径或者包名')
}

export function convertPluginsToObject (items: PluginItem[]) {
  return (type: PluginType) => {
    const obj = {}
    items.forEach(item => {
      if (typeof item === 'string') {
        const name = getPluginPath(item, type)
        obj[name] = null
      } else if (Array.isArray(item)) {
        const name = getPluginPath(item[0], type)
        obj[name] = item[1]
      }
    })
    return obj
  }
}

export function mergePlugins (dist: PluginItem[], src: PluginItem[]) {
  return (type: PluginType) => {
    const srcObj = convertPluginsToObject(src)(type)
    const distObj = convertPluginsToObject(dist)(type)
    return merge(srcObj, distObj)
  }
}

export const getModuleDefaultExport = exports => exports.__esModule ? exports.default : exports

export function resolvePresetsOrPlugins (root: string, args, type: PluginType): IPlugin[] {
  return Object.keys(args).map(item => {
    const fPath = resolve.sync(item, {
      basedir: root,
      extensions: ['.js', '.ts']
    })
    return {
      id: fPath,
      path: fPath,
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
