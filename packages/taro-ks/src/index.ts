import KS from './program'
import type { IPluginContext } from '@tarojs/service'
// 让其它平台插件可以继承此平台
export { KS }

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'ks',
    useConfigName: 'mini',
    async fn ({ config }) {
      const program = new KS(ctx, config)
      await program.start()
    }
  })
}
