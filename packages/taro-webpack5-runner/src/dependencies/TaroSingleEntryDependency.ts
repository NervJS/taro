import { META_TYPE } from '@tarojs/helper'
import webpack from 'webpack'

export default class TaroSingleEntryDependency extends webpack.dependencies.ModuleDependency {
  name: string
  miniType: META_TYPE
  loc: any
  options: Record<string, any>

  constructor (request, name, loc, miniType, options = {}) {
    super(request)
    this.name = name
    this.loc = loc
    this.miniType = miniType
    this.options = options
  }

  // @ts-ignore
  get type () {
    return 'single entry'
  }
}
