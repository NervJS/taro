import path from 'path'

import { name as packageName } from '../package.json'

import type { IPluginContext, TaroPlatformBase } from '@tarojs/service'

export interface IOptions {
  /** 支持 document.cookie 和 http 设置 cookie (默认false) */
  enableCookie?: boolean
  /** 禁用掉 FormData 全局对象 (默认true禁用) */
  disabledFormData?: boolean
  /** 禁用掉 Blob 全局对象 (默认true禁用) */
  disabledBlob?: boolean
}

export default (ctx: IPluginContext) => {
  ctx.modifyWebpackChain(({ chain }) => {
    if (process.env.TARO_PLATFORM === 'mini') {
      chain.plugin('definePlugin').tap(args => args)

      const runtimeAlias = `${packageName}/dist/runtime`
      chain.resolve.alias.set(runtimeAlias, path.join(__dirname, 'runtime.js'))
      // 注入相关全局BOM对象
      chain.plugin('providerPlugin').tap(args => {
        args[0].WebSocket = [runtimeAlias, 'WebSocket']

        return args
      })
    }
  })

  ctx.registerMethod({
    name: 'onSetupClose',
    fn (platform: TaroPlatformBase) {
      if (process.env.TARO_PLATFORM === 'mini') {
        const injectedPath = `post:${packageName}/dist/runtime`
        if (Array.isArray(platform.runtimePath)) {
          platform.runtimePath.push(injectedPath)
        } else if (typeof platform.runtimePath === 'string') {
          platform.runtimePath = [platform.runtimePath, injectedPath]
        }
      }
    },
  })
}
