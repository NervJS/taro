import { TaroPlatformWeb } from '@tarojs/service'

import type { IPluginContext, TConfig } from '@tarojs/service'

const PACKAGE_NAME = '@tarojs/plugin-platform-h5'
export default class H5 extends TaroPlatformWeb {
  platform = 'h5'
  runtimePath = `${PACKAGE_NAME}/dist/runtime`

  constructor (ctx: IPluginContext, config: TConfig) {
    super(ctx, config)
    this.setupTransaction.addWrapper({
      close () {
        this.modifyWebpackConfig()
      }
    })
  }

  /**
   * 修改 Webpack 配置
   */
  modifyWebpackConfig () {
    this.ctx.modifyWebpackChain(({ chain }) => {
      const alias = chain.resolve.alias

      // TODO 在插件内导出 taro-h5
      alias.set('@tarojs/taro', '@tarojs/taro-h5')
      // TODO 将组件库设置迁移至此
      // TODO 为 babel-plugin-transform-taroapi 更新 @tarojs/taro-h5/dist/taroApis
      // TODO 为 postcss-html-transform 更新组件转换列表
    })
  }
}
