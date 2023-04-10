import { isArray, isString } from '@tarojs/shared'
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

export default (ctx: IPluginContext, options: IOptions) => {
  ctx.modifyWebpackChain(({ chain }) => {
    if (process.env.TARO_PLATFORM === 'mini') {
      chain.plugin('definePlugin').tap((args) => {
        args[0].ENABLE_COOKIE = options.enableCookie ?? false
        return args
      })

      const runtimeAlias = `${packageName}/dist/runtime`
      chain.resolve.alias.set(runtimeAlias, path.join(__dirname, 'runtime.js'))
      // 注入相关全局BOM对象
      chain.plugin('providerPlugin').tap((args) => {
        args[0].XMLHttpRequest = [runtimeAlias, 'XMLHttpRequest']

        // 实际上本runtime 没有实现 FormData 和 Blob 对象， 所以第三方库中的这2个对象会被替换成 undefined
        // （axios这类请求库用到了这2个对象，所以要么实现它要么把它替换掉, 这里我们选择把它替换掉，这样可以确保除了上传以外的功能可以继续使用）
        ;(options.disabledFormData ?? true) && (args[0].FormData ||= [runtimeAlias, 'FormData'])
        ;(options.disabledBlob ?? true) && (args[0].Blob ||= [runtimeAlias, 'Blob'])

        return args
      })
    }
  })

  ctx.registerMethod({
    name: 'onSetupClose',
    fn (platform: TaroPlatformBase) {
      if (process.env.TARO_PLATFORM === 'mini') {
        const injectedPath = `post:${packageName}/dist/runtime`
        if (isArray(platform.runtimePath)) {
          platform.runtimePath.push(injectedPath)
        } else if (isString(platform.runtimePath)) {
          platform.runtimePath = [platform.runtimePath, injectedPath]
        }
      }
    },
  })
}
