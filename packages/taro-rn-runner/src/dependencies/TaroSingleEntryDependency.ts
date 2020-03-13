import * as ModuleDependency from 'webpack/lib/dependencies/ModuleDependency'
import { PARSE_AST_TYPE } from '../utils/constants'

export default class TaroSingleEntryDependency extends ModuleDependency {
  name: string
  miniType: PARSE_AST_TYPE
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
