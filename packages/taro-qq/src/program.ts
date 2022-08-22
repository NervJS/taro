import type { IOptions } from '@tarojs/plugin-platform-weapp'
import { Weapp } from '@tarojs/plugin-platform-weapp'

import { components } from './components'

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
