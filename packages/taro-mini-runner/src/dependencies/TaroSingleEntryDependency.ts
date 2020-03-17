import * as ModuleDependency from 'webpack/lib/dependencies/ModuleDependency'
import { META_TYPE } from '@tarojs/runner-utils'

export default class TaroSingleEntryDependency extends ModuleDependency {
  name: string
  miniType: META_TYPE
  loc: any
  oriFile: string
  constructor (request, name, loc, miniType, oriFile) {
    super(request)
    this.name = name
    this.loc = loc
    this.miniType = miniType
    this.oriFile = oriFile
  }

  get type () {
    return 'single entry'
  }
}
