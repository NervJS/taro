import { TaroPlatformBase } from '@tarojs/service'
import { Template } from './template'
import { components } from './components'

const PACKAGE_NAME = '@tarojs/plugin-platform-xhs'

export default class XHS extends TaroPlatformBase {
  platform = 'xhs'
  globalObject = 'xhs'
  projectConfigJson = 'project.config.json'
  runtimePath = `${PACKAGE_NAME}/dist/runtime`
  fileType = {
    templ: '.xhsml',
    style: '.css',
    config: '.json',
    script: '.js'
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
