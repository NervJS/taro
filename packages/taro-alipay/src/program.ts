import { TaroPlatformBase } from '@tarojs/shared'
import { Template } from './template'
import { components } from './components'

const PACKAGE_NAME = '@tarojs/plugin-platform-alipay'

export default class Alipay extends TaroPlatformBase {
  platform = 'alipay'
  globalObject = 'my'
  runtimePath = `${PACKAGE_NAME}/dist/runtime`
  reactComponents = `${PACKAGE_NAME}/dist/components-react`
  fileType = {
    templ: '.axml',
    style: '.acss',
    config: '.json',
    script: '.js',
    xs: '.sjs'
  }

  template = new Template()

  /**
   * 调用 mini-runner 开启编译
   */
  async start () {
    this.setup()
    this.modifyMiniConfigs()
    this.modifyComponents()
    this.modifyWebpackChain()

    const runner = await this.getRunner()
    const options = this.getOptions({
      runtimePath: this.runtimePath
    })
    runner(options)
  }

  /**
   * 转换用户编写的配置（微信小程序标准）为支付宝小程序标准
   */
  modifyMiniConfigs () {
    this.ctx.modifyMiniConfigs(({ configMap }) => {
      const replaceKeyMap = {
        navigationBarTitleText: 'defaultTitle',
        navigationBarBackgroundColor: 'titleBarColor',
        enablePullDownRefresh: 'pullRefresh',
        list: 'items',
        text: 'name',
        iconPath: 'icon',
        selectedIconPath: 'activeIcon',
        color: 'textColor'
      }
      Object.keys(configMap).forEach(key => {
        const item = configMap[key]
        if (item.content) {
          this.recursiveReplaceObjectKeys(item.content, replaceKeyMap)
        }
      })
    })
  }

  /**
   * 增加组件或修改组件属性
   */
  modifyComponents () {
    const { internalComponents } = this.template
    const { recursiveMerge } = this.ctx.helper

    recursiveMerge(internalComponents, components)
    this.modifySlider(internalComponents.Slider)
  }

  /**
   * 修改 Slider 组件属性
   */
  modifySlider (slider) {
    delete slider['block-size']
    delete slider['block-color']
  }

  /**
   * 修改 webpack 配置
   */
  modifyWebpackChain () {
    this.ctx.modifyWebpackChain(({ chain }) => {
      const { taroJsComponents } = this.helper
      chain.resolve.alias.set(taroJsComponents + '$', this.reactComponents)
    })
  }
}
