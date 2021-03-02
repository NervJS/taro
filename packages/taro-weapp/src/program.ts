import { TaroPlatformBase } from '@tarojs/service'
import { Template } from './template'
import { components } from './components'

const PACKAGE_NAME = '@tarojs/plugin-platform-weapp'

export default class Weapp extends TaroPlatformBase {
  platform = 'weapp'
  globalObject = 'wx'
  projectConfigJson: string = this.config.projectConfigName || 'project.config.json'
  runtimePath = `${PACKAGE_NAME}/dist/runtime`
  taroComponentsPath = `${PACKAGE_NAME}/dist/components-react`
  fileType = {
    templ: '.wxml',
    style: '.wxss',
    config: '.json',
    script: '.js',
    xs: '.wxs'
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
    const template = this.template
    template.mergeComponents(this.ctx, components)
    template.voidElements.add('voip-room')
    template.focusComponents.add('editor')
  }
}
