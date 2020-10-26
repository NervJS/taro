import * as ModuleDependency from 'webpack/lib/dependencies/ModuleDependency'
import { META_TYPE } from '@tarojs/helper'

export default class TaroSingleEntryDependency extends ModuleDependency {
  name: string
  miniType: META_TYPE
  loc: any
  constructor (request, name, loc, miniType) {
    super(request)
    this.name = name
    this.loc = loc
    this.miniType = miniType
  }

  get type () {
    return 'single entry'
  }
}
