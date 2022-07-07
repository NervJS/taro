import type { IPluginContext } from '@tarojs/service'

import Swan from './program'

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
}
