import * as NormalModule from 'webpack/lib/NormalModule'
import { PARSE_AST_TYPE } from '../utils/constants'

export default class TaroNormalModule extends NormalModule {
  name: string
  miniType: PARSE_AST_TYPE
  constructor (data) {
    super(data)
    this.name = data.name
    this.miniType = data.miniType
  }
}
