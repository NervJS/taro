import type { IPluginContext } from '@tarojs/service'

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
}
