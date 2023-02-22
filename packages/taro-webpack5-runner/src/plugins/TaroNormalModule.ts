/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { META_TYPE } from '@tarojs/helper'
import webpack from 'webpack'

export default class TaroNormalModule extends webpack.NormalModule {
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

webpack.util.serialization.register(TaroNormalModule, '@tarojs/webpack5-runner/dist/plugins/TaroNormalModule', 'TaroNormalModule', {
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
