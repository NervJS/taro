import * as fs from 'fs-extra'
import * as path from 'path'
import { resolveMainFilePath, chalk } from '@tarojs/helper'

import type { Entry } from 'webpack'
import type { MiniCombination } from './MiniCombination'

let nativePlugin: BuildNativePlugin

export class BuildNativePlugin {
  combination: MiniCombination
  entry: Entry
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
    const entryObj: Entry = {}
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
