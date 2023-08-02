import * as path from 'path'

import { PACKAGE_NAME, PLATFORM_NAME } from '../utils'
import { TaroPlatformHarmony } from './harmony'

import type { IPluginContext, TConfig } from '@tarojs/service'

export default class Harmony extends TaroPlatformHarmony {
  platform = PLATFORM_NAME
  globalObject = 'globalThis'
  fileType = {
    templ: '.hml',
    style: '.css',
    config: '.json',
    script: '.ets'
  }

  useETS = true
  useJSON5 = true
  runtimePath: string[] | string = `${PACKAGE_NAME}/dist/runtime-ets`
  taroComponentsPath = `${PACKAGE_NAME}/dist/components-harmony-ets`

  constructor(ctx: IPluginContext, config: TConfig) {
    super(ctx, config)
    this.setupTransaction.addWrapper({
      close() {
        this.modifyViteConfig()
      },
    })
  }

  get apiLibrary() {
    return path.resolve(__dirname, './apis')
  }

  get componentLibrary() {
    return path.resolve(__dirname, './components-harmony-ets')
  }

  get runtimeLibrary() {
    return path.resolve(__dirname, './runtime-ets')
  }

  get runtimeFrameworkLibrary() {
    return path.resolve(__dirname, './runtime-framework/react')
  }

  /**
   * 修改 Vite 配置
   */
  modifyViteConfig() {
    const that = this
    that.ctx.modifyViteConfig?.(({ viteConfig }) => {
      function aliasPlugin() {
        return {
          name: 'taro:vite-harmony-alias',
          config: () => ({
            resolve: {
              alias: [
                { find: /@tarojs\/components$/, replacement: that.componentLibrary },
                { find: /@tarojs\/taro$/, replacement: that.apiLibrary },
                { find: /@tarojs\/runtime$/, replacement: that.runtimeLibrary },
                { find: /@tarojs\/plugin-framework-react\/dist\/runtime$/, replacement: that.runtimeFrameworkLibrary },
              ],
            },
          }),
        }
      }
      viteConfig.plugins.push(aliasPlugin())
    })
  }
}
