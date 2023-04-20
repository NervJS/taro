import H5 from './program'

import type { IPluginContext } from '@tarojs/service'

// Note: 让其它平台插件可以继承此平台
export { H5 }

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'h5',
    useConfigName: 'h5',
    async fn ({ config }) {
      const program = new H5(ctx, config)
      await program.start()
    }
  })
}
