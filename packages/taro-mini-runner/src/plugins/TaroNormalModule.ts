import { META_TYPE } from '@tarojs/helper'
import * as NormalModule from 'webpack/lib/NormalModule'

export default class TaroNormalModule extends NormalModule {
  name: string
  miniType: META_TYPE
  constructor (data) {
    super(data)
    this.name = data.name
    this.miniType = data.miniType
  }
}
