import { isArray, isObject, isString } from '@tarojs/shared'
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

      if (ctx.initialConfig.compiler === 'webpack4' || (isObject<boolean>(ctx.initialConfig.compiler) && ctx.initialConfig.compiler.type === 'webpack4')) {
        // taro webpack4 中, 未正确识别到 axios package.json 中的 browser 字段, 以致于打包进入了 node 相关的代码（https://github.com/axios/axios/blob/59eb99183546d822bc27e881f5dcd748daa04173/package.json#L128-L132）
        const inAxiosReg = /(\/|\\)(node_modules)(\/|\\)(axios)(\/|\\)/
        chain.merge({
          externals: [
            (context, request, callback) => {
              if (inAxiosReg.test(context) && request.includes('http.js')) {
                // 将 http 适配器从源码里干掉 https://github.com/axios/axios/blob/59eb99183546d822bc27e881f5dcd748daa04173/lib/adapters/adapters.js#L2
                return callback(null, 'var undefined')
              }
              callback()
            }
          ]
        })
      }
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
