import { TaroPlatformBase } from '@tarojs/service'
import { Template } from './template'
import { components } from './components'

const PACKAGE_NAME = '@tarojs/plugin-platform-quickapp'

export default class QuickApp extends TaroPlatformBase {
  platform = 'quickapp'
  globalObject = 'global'
  runtimePath = `${PACKAGE_NAME}/dist/runtime`
  taroComponentsPath = `${PACKAGE_NAME}/dist/components-react`
  fileType = {
    templ: '.ux',
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
      close: () => {
        this.modifyMiniConfigs()
        this.modifyTemplate()
      }
    })
  }

  /**
   * 转换用户编写的配置（微信小程序标准）为快应用标准
   */
  modifyMiniConfigs () {
    this.ctx.modifyMiniConfigs(({ configMap }) => {
      const replaceKeyMap = {
        navigationBarTitleText: 'titleBarText',
        navigationBarBackgroundColor: 'titleBarBackgroundColor',
        navigationBarTextStyle: 'titleBarTextColor',
        pageOrientation: 'orientation',
        backgroundTextStyle: false,
        onReachBottomDistance: false,
        backgroundColorBottom: false,
        backgroundColorTop: false
      }
      Object.keys(configMap).forEach(key => {
        const item = configMap[key]
        if (item.content) {
          this.recursiveReplaceObjectKeys(item.content, replaceKeyMap)
          this.traverseModifyConfig(item.content, (key, value, parent) => {
            if (key === 'navigationStyle' && value === 'custom') {
              delete parent[key]
              parent.fullScreen = true
              parent.titleBar = false
            }
          })
        }
      })
    })
  }

  /**
 * 递归遍历修改config
 */
  protected traverseModifyConfig (obj: any, func: (key: string, value: any, parent: any) => void) {
    for (const key in obj) {
      const value = obj[key]
      if (typeof value === 'object' && value !== null) {
        this.traverseModifyConfig(value, func)
      }
      func(key, value, obj)
    }
  }

  /**
   * 增加组件或修改组件属性
   */
  modifyTemplate () {
    const template = this.template
    template.mergeComponents(this.ctx, components)
  }
}
