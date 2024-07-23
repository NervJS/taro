import { TaroPlatformBase } from '@tarojs/service'

import { components } from './components'
import { Template } from './template'

const PACKAGE_NAME = '@tarojs/plugin-platform-jd'

export default class JD extends TaroPlatformBase {
  platform = 'jd'
  globalObject = 'jd'
  projectConfigJson = 'project.jd.json'
  runtimePath = `${PACKAGE_NAME}/dist/runtime`
  fileType = {
    templ: '.jxml',
    style: '.jxss',
    config: '.json',
    script: '.js',
    xs: '.jds'
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
      close: this.modifyTemplate
    })
  }

  /**
   * 增加组件或修改组件属性
   */
  modifyTemplate () {
    this.template.mergeComponents(this.ctx, components)
  }
}
