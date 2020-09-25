import { TaroPlatformBase } from '@tarojs/service'
import { Template } from './template'
import { components } from './components'

const PACKAGE_NAME = '@tarojs/plugin-platform-tt'

export default class TT extends TaroPlatformBase {
  platform = 'tt'
  globalObject = 'tt'
  projectConfigJson = 'project.tt.json'
  runtimePath = `${PACKAGE_NAME}/dist/runtime`
  fileType = {
    templ: '.ttml',
    style: '.ttss',
    config: '.json',
    script: '.js'
  }

  template = new Template()

  /**
   * 调用 mini-runner 开启编译
   */
  async start () {
    this.setup()
    this.generateProjectConfig(this.projectConfigJson)
    this.modifyComponents()

    const runner = await this.getRunner()
    const options = this.getOptions({
      runtimePath: this.runtimePath
    })
    runner(options)
  }

  /**
   * 增加组件或修改组件属性
   */
  modifyComponents () {
    const { internalComponents } = this.template
    const { recursiveMerge } = this.ctx.helper

    recursiveMerge(internalComponents, components)
  }
}
