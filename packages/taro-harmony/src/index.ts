import Harmony from './program'

import type { IPluginContext } from '@tarojs/service'

// 让其它平台插件可以继承此平台
export { Harmony }

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'harmony',
    useConfigName: 'mini',
    async fn ({ config }) {
      const program = new Harmony(ctx, config)
      await program.start()
    }
  })
}
