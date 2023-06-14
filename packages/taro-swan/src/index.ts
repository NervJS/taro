import { isString } from '@tarojs/shared'

import Swan from './program'

import type { IPluginContext } from '@tarojs/service'

// 让其它平台插件可以继承此平台
export { Swan }

export interface IOptions {
  flattenViewLevel?: number
  flattenCoverLevel?: number
  flattenTextLevel?: number
}

export default (ctx: IPluginContext, options: IOptions = {}) => {
  ctx.registerPlatform({
    name: 'swan',
    useConfigName: 'mini',
    async fn ({ config }) {
      const program = new Swan(ctx, config, options)
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
