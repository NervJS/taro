/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { chalk, getModuleDefaultExport } from '@tarojs/helper'
import { merge } from 'lodash'
import * as path from 'path'
import * as resolve from 'resolve'

import { PluginType } from './constants'
import { IPlugin, IPluginsObject } from './types'

import type { PluginItem } from '@tarojs/taro/types/compile'

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
export function resolvePresetsOrPlugins (root: string, args, type: PluginType): IPlugin[] {
  return Object.keys(args).map(item => {
    let fPath
    try {
      fPath = resolve.sync(item, {
        basedir: root,
        extensions: ['.js', '.ts']
      })
    } catch (err) {
      if (args[item]?.backup) {
        // 如果项目中没有，可以使用 CLI 中的插件
        fPath = args[item].backup
      } else {
        console.log(chalk.red(`找不到依赖 "${item}"，请先在项目中安装`))
        process.exit(1)
      }
    }
    return {
      id: fPath,
      path: fPath,
      type,
      opts: args[item] || {},
      apply () {
        try {
          return getModuleDefaultExport(require(fPath))
        } catch (error) {
          console.error(error)
          throw new Error(`插件依赖 "${item}" 加载失败，请检查插件配置`)
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
