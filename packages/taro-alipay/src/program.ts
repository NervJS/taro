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

const PACKAGE_NAME = '@tarojs/plugin-platform-alipay'

export default class Alipay extends TaroPlatformBase {
  platform = 'alipay'
  globalObject = 'my'
  runtimePath = `${PACKAGE_NAME}/dist/runtime`
  taroComponentsPath = `${PACKAGE_NAME}/dist/components-react`
  fileType = {
    templ: '.axml',
    style: '.acss',
    config: '.json',
    script: '.js',
    xs: '.sjs'
  }

  template = new Template()

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
        this.modifyMiniConfigs()
        this.modifyComponents()
        this.modifyWebpackConfig()
        this.generateProjectConfig('project.alipay.json', 'mini.project.json')
      }
    })
  }

  /**
   * 转换用户编写的配置（微信小程序标准）为支付宝小程序标准
   */
  modifyMiniConfigs () {
    this.ctx.modifyMiniConfigs(({ configMap }) => {
      const replaceKeyMap = {
        navigationBarTitleText: 'defaultTitle',
        navigationBarBackgroundColor: 'titleBarColor',
        enablePullDownRefresh: 'pullRefresh',
        list: 'items',
        text: 'name',
        iconPath: 'icon',
        selectedIconPath: 'activeIcon',
        color: 'textColor'
      }
      Object.keys(configMap).forEach(key => {
        const item = configMap[key]
        if (item.content) {
          this.recursiveReplaceObjectKeys(item.content, replaceKeyMap)
        }
      })
    })
  }

  /**
   * 增加组件或修改组件属性
   */
  modifyComponents () {
    const { internalComponents } = this.template
    this.template.mergeComponents(this.ctx, components)
    this.modifySlider(internalComponents.Slider)
    this.modifySwiper(internalComponents.Swiper)
  }

  /**
   * 修改 Slider 组件属性
   */
  modifySlider (slider) {
    delete slider['block-size']
    delete slider['block-color']
  }

  /**
   * 修改 Swiper 组件属性
   */
  modifySwiper (swiper) {
    delete swiper.bindAnimationFinish
  }

  /**
   * 修改 Webpack 配置
   */
  modifyWebpackConfig () {
    this.ctx.modifyWebpackChain(({ chain }) => {
      // 支付宝系小程序全局就有 navigator 对象，不需要模拟
      chain.plugin('providerPlugin')
        .tap(args => {
          const newArgs = Object.assign({}, args[0])
          delete newArgs.navigator
          return [newArgs]
        })
    })
  }
}
