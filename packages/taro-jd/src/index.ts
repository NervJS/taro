import type { IPluginContext } from '@tarojs/service'
import { isString } from '@tarojs/shared'

import JD from './program'

// 让其它平台插件可以继承此平台
export { JD }

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'jd',
    useConfigName: 'mini',
    async fn ({ config }) {
      const program = new JD(ctx, config)
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
          target: 'es5'
        }
      }
      prebundleOptions.exclude ||= []
      prebundleOptions.include ||= []
    }
  })
}
