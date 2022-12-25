import { isArray, isString } from '@tarojs/shared'
import path from 'path'

import { name as packageName } from '../package.json'

import type { IPluginContext, TaroPlatformBase } from '@tarojs/service'

interface IOptions {
  /** 支持 document.cookie 和 http 设置 cookie */
  enableCookie?: boolean
  /** 支持注入 FormData 对象实现  */
  enableFormData?: boolean
  /** 支持注入 Blob 对象实现 */
  enableBlob?: boolean
}

export default (ctx: IPluginContext, _options: IOptions) => {
  ctx.modifyWebpackChain(({ chain }) => {
    const runtimeAlia = `${packageName}/dist/runtime`
    chain.resolve.alias.set(runtimeAlia, path.join(__dirname, 'runtime.js'))
    // 注入相关全局BOM对象
    chain.plugin('providerPlugin').tap((args) => {
      args[0].XMLHttpRequest = [runtimeAlia, 'XMLHttpRequest']
      // 实际上本runtime 没有实现 FormData 和 Blob 对象， 所以第三方库中的这2个对象会被替换成 undefined
      args[0].FormData ||= [runtimeAlia, 'FormData']
      args[0].Blob ||= [runtimeAlia, 'Blob']
      // args[0].FormData ||= ['miniprogram-formdata', 'default']
      // args[0].Blob ||= ['miniprogram-blob', 'default']
      return args
    })
  })

  ctx.registerMethod({
    name: 'onSetupClose',
    fn (platform: TaroPlatformBase) {
      const injectedPath = `${packageName}/dist/runtime`
      if (isArray(platform.runtimePath)) {
        platform.runtimePath.push(injectedPath)
      } else if (isString(platform.runtimePath)) {
        platform.runtimePath = [platform.runtimePath, injectedPath]
      }
    },
  })
}
