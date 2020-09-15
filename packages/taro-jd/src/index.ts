import JD from './program'
import type { IPluginContext } from '@tarojs/service'

// 让其它平台插件可以继承此平台
export { JD }

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'jd',
    useConfigName: 'mini',
    async fn ({ config }) {
      const program = new JD(ctx, config)
      program.start()
    }
  })
}
