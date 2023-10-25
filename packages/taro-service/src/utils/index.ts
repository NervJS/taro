import { chalk, getModuleDefaultExport } from '@tarojs/helper'
import { merge } from 'lodash'
import * as path from 'path'
import * as resolve from 'resolve'

import { PluginType } from './constants'

import type { PluginItem } from '@tarojs/taro/types/compile'
import type { IPlugin, IPluginsObject } from './types'

export const isNpmPkg: (name: string) => boolean = name => !(/^(\.|\/)/.test(name))

export function getPluginPath (pluginPath: string) {
  if (isNpmPkg(pluginPath) || path.isAbsolute(pluginPath)) return pluginPath
  throw new Error('plugin 和 preset 配置必须为绝对路径或者包名')
}

export function convertPluginsToObject (items: PluginItem[]): () => IPluginsObject {
  return () => {
    const obj: IPluginsObject = {}
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
    return merge(distObj, srcObj)
  }
}

// getModuleDefaultExport
export function resolvePresetsOrPlugins (root: string, args: IPluginsObject, type: PluginType, skipError?: boolean): IPlugin[] {
  // 全局的插件引入报错，不抛出 Error 影响主流程，而是通过 log 提醒然后把插件 filter 掉，保证主流程不变
  const resolvedPresetsOrPlugins: IPlugin[] =  []
  const presetsOrPluginsNames = Object.keys(args) || []
  for( let i = 0; i < presetsOrPluginsNames.length; i++ ) {
    const item = presetsOrPluginsNames[i]
    let fPath
    try {
      fPath = resolve.sync(item, {
        basedir: root,
        extensions: ['.js', '.ts']
      })
    } catch (err) {
      if (args[item]?.backup) {
        // 如果项目中没有，可以使用 CLI 中的插件
        fPath = args[item]?.backup
      } else if (skipError) {
        // 如果跳过报错，那么 log 提醒，并且不使用该插件
        console.log(chalk.yellow(`找不到插件依赖 "${item}"，请先在项目中安装，项目路径：${root}`))
        continue
      } else {
        console.log(chalk.red(`找不到插件依赖 "${item}"，请先在项目中安装，项目路径：${root}`))
        process.exit(1)
      }
    }
    const resolvedItem = {
      id: fPath,
      path: fPath,
      type,
      opts: args[item] || {},
      apply () {
        try {
          return getModuleDefaultExport(require(fPath))
        } catch (error) {
          console.error(error)
          // 全局的插件运行报错，不抛出 Error 影响主流程，而是通过 log 提醒然后把插件 filter 掉，保证主流程不变
          if(skipError) {
            console.error(`插件依赖 "${item}" 加载失败，请检查插件配置`)
          } else {
            throw new Error(`插件依赖 "${item}" 加载失败，请检查插件配置`)
          }
        }
      }
    }
    resolvedPresetsOrPlugins.push(resolvedItem)
  }

  return resolvedPresetsOrPlugins
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
