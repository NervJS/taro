import XHS from './program'
import type { IPluginContext } from '@tarojs/service'

// 让其它平台插件可以继承此平台
export { XHS }

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'xhs',
    useConfigName: 'mini',
    async fn ({ config }) {
      const program = new XHS(ctx, config)
      await program.start()
    }
  })
}
