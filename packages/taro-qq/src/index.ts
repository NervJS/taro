import QQ from './program'

import type { IOptions } from '@tarojs/plugin-platform-weapp'
import type { IPluginContext } from '@tarojs/service'

export { QQ }

export default (ctx: IPluginContext, options: IOptions) => {
  ctx.registerPlatform({
    name: 'qq',
    useConfigName: 'mini',
    async fn ({ config }) {
      const program = new QQ(ctx, config, options)
      await program.start()
    }
  })
}
