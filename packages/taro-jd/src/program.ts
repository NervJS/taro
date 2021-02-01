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
}
