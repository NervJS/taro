import { META_TYPE } from '@tarojs/helper'

import TaroSingleEntryDependency from '../dependencies/TaroSingleEntryDependency'

export default class TaroSingleEntryPlugin {
  context: any
  entry: string
  name: string
  miniType: META_TYPE

  constructor (context, entry, name, miniType) {
    this.context = context
    this.entry = entry
    this.name = name
    this.miniType = miniType
  }

  apply (compiler) {
    compiler.hooks.compilation.tap(
      'TaroSingleEntryDependency',
      (compilation, { normalModuleFactory }) => {
        compilation.dependencyFactories.set(
          TaroSingleEntryDependency,
          normalModuleFactory
        )
      }
    )

    compiler.hooks.make.tapAsync(
      'SingleEntryPlugin',
      (compilation, callback) => {
        const { entry, name, context, miniType } = this

        const dep = TaroSingleEntryPlugin.createDependency(entry, name, miniType)
        compilation.addEntry(context, dep, name, callback)
      }
    )
  }

  static createDependency (entry, name, miniType) {
    return new TaroSingleEntryDependency(entry, name, { name }, miniType)
  }
}
