import { parseNativePluginConfig } from '@tarojs/runner-utils'
import { EntryObject } from 'webpack'

import type { MiniCombination } from './MiniCombination'

let nativePlugin: BuildNativePlugin

export class BuildNativePlugin {
  combination: MiniCombination
  entry: EntryObject
  pluginConfig: Record<string, any>
  pluginMainEntry: string
  commonChunks = ['runtime', 'vendors', 'taro', 'common']

  constructor (combination: MiniCombination) {
    this.combination = combination
    this.init()
  }

  static getPlugin (combination: MiniCombination) {
    nativePlugin ||= new BuildNativePlugin(combination)
    return nativePlugin
  }

  init () {
    const res = parseNativePluginConfig(this.combination.sourceDir)
    if (!res) return
    this.entry = res.entry
    this.pluginConfig = res.pluginConfig
    this.pluginMainEntry = res.pluginMainEntry
  }
}
