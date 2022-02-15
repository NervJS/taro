import { dependencies } from 'webpack'
import { META_TYPE } from '@tarojs/helper'

export default class TaroSingleEntryDependency extends dependencies.ModuleDependency {
  name: string
  miniType: META_TYPE
  loc: any
  constructor (request, name, loc, miniType) {
    super(request)
    this.name = name
    this.loc = loc
    this.miniType = miniType
  }

  // @ts-ignore
  get type () {
    return 'single entry'
  }
}
