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

import { isString } from '@tarojs/shared'

import Swan from './program'

import type { IPluginContext } from '@tarojs/service'

// 让其它平台插件可以继承此平台
export { Swan }

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'swan',
    useConfigName: 'mini',
    async fn ({ config }) {
      const program = new Swan(ctx, config)
      await program.start()
    }
  })

  ctx.modifyRunnerOpts(({ opts }) => {
    if (!opts?.compiler) return

    if (isString(opts.compiler)) {
      opts.compiler = {
        type: opts.compiler
      }
    }
    const { compiler } = opts
    if (compiler.type === 'webpack5') {
      compiler.prebundle ||= {}
      const prebundleOptions = compiler.prebundle
      if (prebundleOptions.enable === false) return
      prebundleOptions.swc ||= {
        jsc: {
          // Note: 由于百度小程序不支持 ES2015，所以这里需要将 ES5 (模拟器环境可无该问题)
          target: 'es5'
        }
      }
      prebundleOptions.exclude ||= []
      prebundleOptions.include ||= []
    }
  })
}
