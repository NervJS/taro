import AscfApp from './program'

import type { IPluginContext } from '@tarojs/service'

// 让其它平台插件可以继承此平台
export { AscfApp }

export interface IOptions {
  enablekeyboardAccessory?: boolean
}

export default (ctx: IPluginContext, options: IOptions) => {
  ctx.registerPlatform({
    name: 'ascf',
    useConfigName: 'ascf',
    async fn ({ config }) {
      const program = new AscfApp(ctx, config, options || {})
      await program.start()
    }
  })
}
