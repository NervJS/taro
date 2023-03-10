/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import TaroSingleEntryDependency from '../dependencies/TaroSingleEntryDependency'

export default class TaroSingleEntryPlugin {
  context: any
  entry: string
  name: string
  miniType: META_TYPE

  constructor (context, entry, name, miniType) {
    this.context = context
    this.entry = entry
    this.name = name
    this.miniType = miniType
  }

  apply (compiler) {
    compiler.hooks.compilation.tap(
      'TaroSingleEntryDependency',
      (compilation, { normalModuleFactory }) => {
        compilation.dependencyFactories.set(
          TaroSingleEntryDependency,
          normalModuleFactory
        )
      }
    )

    compiler.hooks.make.tapAsync(
      'SingleEntryPlugin',
      (compilation, callback) => {
        const { entry, name, context, miniType } = this

        const dep = TaroSingleEntryPlugin.createDependency(entry, name, miniType)
        compilation.addEntry(context, dep, name, callback)
      }
    )
  }

  static createDependency (entry, name, miniType) {
    return new TaroSingleEntryDependency(entry, name, { name }, miniType)
  }
}
