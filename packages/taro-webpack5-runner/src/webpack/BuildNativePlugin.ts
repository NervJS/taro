/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import { chalk, resolveMainFilePath } from '@tarojs/helper'
import fs from 'fs-extra'
import path from 'path'
import { EntryObject } from 'webpack'

import type { MiniCombination } from './MiniCombination'

let nativePlugin: BuildNativePlugin

export class BuildNativePlugin {
  combination: MiniCombination
  entry: EntryObject
  pluginConfig: Record<string, any>
  pluginMainEntry: string
  chunkPrefix: string
  commonChunks = ['plugin/runtime', 'plugin/vendors', 'plugin/taro', 'plugin/common']

  constructor (combination: MiniCombination) {
    this.combination = combination
    this.chunkPrefix = 'plugin/'
    this.init()
  }

  static getPlugin (combination: MiniCombination) {
    nativePlugin ||= new BuildNativePlugin(combination)
    return nativePlugin
  }

  init () {
    const sourceDir = this.combination.sourceDir
    const pluginDir = path.join(sourceDir, 'plugin')
    const pluginConfigPath = path.join(pluginDir, 'plugin.json')

    if (!fs.existsSync(pluginDir)) return console.log(chalk.red('插件目录不存在，请检查！'))
    if (!fs.existsSync(pluginConfigPath)) return console.log(chalk.red('缺少插件配置文件，请检查！'))

    const pluginConfig = fs.readJSONSync(pluginConfigPath)
    const entryObj: EntryObject = {}
    let pluginMainEntry = ''

    Object.keys(pluginConfig).forEach(key => {
      if (key === 'main') {
        const filePath = path.join(pluginDir, pluginConfig[key])
        const fileName = path.basename(filePath).replace(path.extname(filePath), '')
        pluginMainEntry = `plugin/${fileName}`
        entryObj[pluginMainEntry] = [resolveMainFilePath(filePath.replace(path.extname(filePath), ''))]
      } else if (key === 'publicComponents' || key === 'pages') {
        Object.keys(pluginConfig[key]).forEach(subKey => {
          const filePath = path.join(pluginDir, pluginConfig[key][subKey])
          entryObj[`plugin/${pluginConfig[key][subKey]}`] = [resolveMainFilePath(filePath.replace(path.extname(filePath), ''))]
        })
      }
    })

    this.entry = entryObj
    this.pluginConfig = pluginConfig
    this.pluginMainEntry = pluginMainEntry
  }

  getCopyPattern () {
    const { sourceRoot, outputRoot } = this.combination
    return {
      from: path.join(sourceRoot, 'plugin', 'doc'),
      to: path.join(outputRoot, 'doc')
    }
  }
}
