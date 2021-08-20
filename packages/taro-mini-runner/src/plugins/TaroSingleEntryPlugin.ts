/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
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
