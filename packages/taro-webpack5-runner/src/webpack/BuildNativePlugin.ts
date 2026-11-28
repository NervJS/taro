import { BaseBuildNativePluginConfig } from '@tarojs/runner-utils/bundler/config/BuildNativePlugin'

import type { EntryObject } from 'webpack'
import type { MiniCombination } from './MiniCombination'

let nativePlugin: BuildNativePlugin

export class BuildNativePlugin extends BaseBuildNativePluginConfig<MiniCombination, EntryObject> {
  static getPlugin (combination: MiniCombination) {
    nativePlugin ||= new BuildNativePlugin(combination)
    return nativePlugin
  }
}
