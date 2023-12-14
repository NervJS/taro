import H5 from './program'

import type { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'mpharmony',
    useConfigName: 'h5',
    async fn ({ config }) {
      const program = new H5(ctx, config)
      await program.start()
    },
  })
}
