import { TaroPlatformBase } from '@tarojs/service'
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
    const options = this.getOptions({
      runtimePath: this.runtimePath
    })
    runner(options)
  }
}
