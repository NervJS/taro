
import { TaroPlatformBase } from '@tarojs/service'
import { Template } from './template'
import { components } from './components'

const PACKAGE_NAME = '@tarojs/plugin-platform-myHarmony'

export default class MyHarmony extends TaroPlatformBase {
  // 平台名称
  platform = 'myHarmony'
  // 小程序全局对象
  globalObject = 'harmony'
  // 小程序编译的运行时文件的解析路径
  runtimePath = `${PACKAGE_NAME}/dist/runtime`
  // 组件路径
  taroComponentsPath = `${PACKAGE_NAME}/dist/components-react`
  // 文件后缀
  fileType = {
    // 模板文件后缀
    templ: '.hml',
    // 样式文件后缀
    style: '.css',
    // 配置文件后缀
    config: '.json',
    // 脚本文件后缀
    script: '.js',
  }

  // 模板实例
  template: any = new Template()

  constructor (ctx, config) {
    super(ctx, config)

    /**
    * 1. setupTransaction - init
    * 2. setup
    * 3. setupTransaction - close
    * 4. buildTransaction - init
    * 5. build
    * 6. buildTransaction - close
    */

    // 可以在 setup 的不同阶段注入自定义逻辑
    this.setupTransaction.addWrapper({
      init () {},
      close () {
        this.modifyTemplate()
      }
    })

    // 可以在 build 的不同阶段注入自定义逻辑
    this.buildTransaction.addWrapper({
      init () {},
      close () {}
    })
  }

  modifyTemplate () {
    this.template.mergeComponents(this.ctx, components)
  }

}
