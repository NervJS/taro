import * as NormalModule from 'webpack/lib/NormalModule'
import { META_TYPE } from '@tarojs/runner-utils'

export default class TaroNormalModule extends NormalModule {
  name: string
  miniType: META_TYPE
  oriFile: string
  constructor (data) {
    super(data)
    this.name = data.name
    this.miniType = data.miniType
    this.oriFile = data.oriFile
  }
}
