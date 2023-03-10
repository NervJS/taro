/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { isArray, isString } from '@tarojs/shared'
import path from 'path'

import { name as packageName } from '../package.json'

import type { IPluginContext, TaroPlatformBase } from '@tarojs/service'

interface IOptions {
  /** 支持 document.cookie 和 http 设置 cookie (默认false) */
  enableCookie?: boolean
  /** 禁用掉 FormData 全局对象 (默认true禁用) */
  disabledFormData?: boolean
  /** 禁用掉 Blob 全局对象 (默认true禁用) */
  disabledBlob?: boolean
}

export default (ctx: IPluginContext, options: IOptions) => {
  if (!['h5', 'rn'].includes(ctx.runOpts.options.platform)) {
    ctx.modifyWebpackChain(({ chain }) => {
      chain.plugin('definePlugin').tap((args) => {
        args[0].ENABLE_COOKIE = options.enableCookie ?? false
        return args
      })

      const runtimeAlia = `${packageName}/dist/runtime`
      chain.resolve.alias.set(runtimeAlia, path.join(__dirname, 'runtime.js'))
      // 注入相关全局BOM对象
      chain.plugin('providerPlugin').tap((args) => {
        args[0].XMLHttpRequest = [runtimeAlia, 'XMLHttpRequest']

        // 实际上本runtime 没有实现 FormData 和 Blob 对象， 所以第三方库中的这2个对象会被替换成 undefined
        // （axios这类请求库用到了这2个对象，所以要么实现它要么把它替换掉, 这里我们选择把它替换掉，这样可以确保除了上传以外的功能可以继续使用）
        ;(options.disabledFormData ?? true) && (args[0].FormData ||= [runtimeAlia, 'FormData'])
        ;(options.disabledBlob ?? true) && (args[0].Blob ||= [runtimeAlia, 'Blob'])

        return args
      })
    })

    ctx.registerMethod({
      name: 'onSetupClose',
      fn (platform: TaroPlatformBase) {
        const injectedPath = `post:${packageName}/dist/runtime`
        if (isArray(platform.runtimePath)) {
          platform.runtimePath.push(injectedPath)
        } else if (isString(platform.runtimePath)) {
          platform.runtimePath = [platform.runtimePath, injectedPath]
        }
      },
    })
  }
}
