import { TaroPlatformBase } from '@tarojs/shared'
import { Template } from './template'

export default class JD extends TaroPlatformBase {
  platform = 'jd'
  globalObject = 'jd'
  projectConfigJson = 'project.jd.json'
  fileType = {
    templ: '.jxml',
    style: '.jxss',
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

    const runner = await this.getRunner()
    const options = this.getBaseOptions()
    runner(options)
  }
}
