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

import { TaroPlatformBase } from '@tarojs/service'

import { components } from './components'
import { Template } from './template'

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
