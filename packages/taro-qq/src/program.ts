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

  constructor (ctx, config) {
    super(ctx, config)

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

  /**
   * 增加组件或修改组件属性
   */
  modifyComponents () {
    // 先按微信标准对齐组件
    super.modifyComponents()

    // 再处理 QQ 与微信的组件差异
    this.template.mergeComponents(this.ctx, components)
  }
}
