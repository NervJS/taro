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

import { TaroPlatformBase } from '@tarojs/service'
import { Template } from './template'
import { components } from './components'

const PACKAGE_NAME = '@tarojs/plugin-platform-swan'
const PROJECT_JSON = 'project.swan.json'

export default class Swan extends TaroPlatformBase {
  platform = 'swan'
  globalObject = 'swan'
  runtimePath = `${PACKAGE_NAME}/dist/runtime`
  taroComponentsPath = `${PACKAGE_NAME}/dist/components-react`
  fileType = {
    templ: '.swan',
    style: '.css',
    config: '.json',
    script: '.js',
    xs: '.sjs'
  }

  template: Template

  /**
   * 1. setupTransaction - init
   * 2. setup
   * 3. setupTransaction - close
   * 4. buildTransaction - init
   * 5. build
   * 6. buildTransaction - close
   */
  constructor (ctx, config) {
    super(ctx, config)

    this.setupTransaction.addWrapper({
      close () {
        this.modifyComponents()
        ctx.generateFrameworkInfo()
        this.generateProjectConfig(PROJECT_JSON, PROJECT_JSON)
      }
    })

    this.template = new Template({
      flattenViewLevel: config.flattenViewLevel
    })
  }

  /**
   * 增加组件或修改组件属性
   */
  modifyComponents () {
    this.template.mergeComponents(this.ctx, components)
    delete this.template.internalComponents.Input.cursor
    delete this.template.internalComponents.Input['selection-start']
    delete this.template.internalComponents.Input['selection-end']
  }
}
