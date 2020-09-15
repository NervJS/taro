import Alipay from './program'
import type { IPluginContext } from '@tarojs/service'

// 让其它平台插件可以继承此平台
export { Alipay }

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'alipay',
    useConfigName: 'mini',
    async fn ({ config }) {
      const program = new Alipay(ctx, config)
      program.start()
    }
  })
}
