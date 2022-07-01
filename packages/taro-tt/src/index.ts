import type { IPluginContext } from '@tarojs/service'

import TT from './program'

// 让其它平台插件可以继承此平台
export { TT }

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'tt',
    useConfigName: 'mini',
    async fn ({ config }) {
      const program = new TT(ctx, config)
      await program.start()
    }
  })
}
