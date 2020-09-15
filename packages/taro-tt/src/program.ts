import { TaroPlatformBase } from '@tarojs/shared'
import { Template } from './template'
import { components } from './components'

export default class TT extends TaroPlatformBase {
  platform = 'tt'
  globalObject = 'tt'
  projectConfigJson = 'project.tt.json'
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
    const options = this.getBaseOptions()
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
