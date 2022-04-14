import { NormalModule, util } from 'webpack'
import { META_TYPE } from '@tarojs/helper'

export default class TaroNormalModule extends NormalModule {
  name: string
  miniType: META_TYPE
  constructor (data) {
    super(data)
    this.name = data.name
    this.miniType = data.miniType
  }

  serialize (context) {
    const { write } = context
    write(this.name)
    write(this.miniType)
    super.serialize(context)
  }

  deserialize (context) {
    const { read } = context
    this.name = read()
    this.miniType = read()
    super.deserialize(context)
  }
}

util.serialization.register(TaroNormalModule, '@tarojs/webpack5-runner/dist/plugins/TaroNormalModule', 'TaroNormalModule', {
  serialize (obj, context) {
    obj.serialize(context)
  },
  deserialize (context) {
    const obj = new TaroNormalModule({
      // will be deserialized by Module
      layer: null,
      type: '',
      // will be filled by updateCacheModule
      resource: '',
      context: '',
      request: null,
      userRequest: null,
      rawRequest: null,
      loaders: null,
      matchResource: null,
      parser: null,
      parserOptions: null,
      generator: null,
      generatorOptions: null,
      resolveOptions: null
    })
    obj.deserialize(context)
    return obj
  }
})
