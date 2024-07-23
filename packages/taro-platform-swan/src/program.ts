import { TaroPlatformBase } from '@tarojs/service'

import { components } from './components'
import { Template } from './template'

import type { IPluginContext } from '@tarojs/service'
import type { IOptions } from './index'

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
  constructor (ctx: IPluginContext, config, options: IOptions = {}) {
    super(ctx, config)

    this.setupTransaction.addWrapper({
      close () {
        this.modifyComponents()
        ctx.generateFrameworkInfo()
        this.generateProjectConfig(PROJECT_JSON, PROJECT_JSON)
      }
    })

    this.template = new Template({
      flattenViewLevel: options.flattenViewLevel,
      flattenCoverLevel: options.flattenCoverLevel,
      flattenTextLevel: options.flattenTextLevel,
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
