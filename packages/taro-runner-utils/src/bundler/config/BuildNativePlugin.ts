import { parseNativePluginConfig } from '../utils'

export class BaseBuildNativePluginConfig<TCombination extends { sourceDir: string } = any, TEntry = Record<string, string[]>> {
  combination: TCombination
  entry: TEntry
  pluginConfig: Record<string, any>
  pluginMainEntry: string
  commonChunks = ['runtime', 'vendors', 'taro', 'common']

  constructor (combination: TCombination) {
    this.combination = combination
    this.init()
  }

  init () {
    const res = parseNativePluginConfig(this.combination.sourceDir)
    if (!res) { return }
    this.entry = res.entry as TEntry
    this.pluginConfig = res.pluginConfig
    this.pluginMainEntry = res.pluginMainEntry
  }
}
