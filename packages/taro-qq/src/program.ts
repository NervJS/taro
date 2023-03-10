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
