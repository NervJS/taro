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

import { Weapp } from '@tarojs/plugin-platform-weapp'
import { components } from './components'

import type { IOptions } from '@tarojs/plugin-platform-weapp'

const PACKAGE_NAME = '@tarojs/plugin-platform-qq'

export default class QQ extends Weapp {
  platform = 'qq'
  globalObject = 'qq'
  projectConfigJson = 'project.qq.json'
  runtimePath = `${PACKAGE_NAME}/dist/runtime`
  fileType = {
    templ: '.qml',
    style: '.qss',
    config: '.json',
    script: '.js',
    xs: '.wxs'
  }

  /**
   * 1. setupTransaction - init
   * 2. setup
   * 3. setupTransaction - close
   * 4. buildTransaction - init
   * 5. build
   * 6. buildTransaction - close
   */
  constructor (ctx, config, pluginOptions: IOptions) {
    super(ctx, config, pluginOptions)

    this.buildTransaction.addWrapper({
      init: this.beforeBuild
    })
  }

  beforeBuild () {
    // 处理 QQ 与微信的组件差异
    this.template.mergeComponents(this.ctx, components)
    this.template.Adapter = {
      if: 'qq:if',
      else: 'qq:else',
      elseif: 'qq:elif',
      for: 'qq:for',
      forItem: 'qq:for-item',
      forIndex: 'qq:for-index',
      key: 'qq:key',
      xs: 'wxs',
      type: 'qq'
    }
  }
}
