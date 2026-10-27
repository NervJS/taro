import { components } from './components'
import Weapp from './program'

import type { IPluginContext } from '@tarojs/service'

// 让其它平台插件可以继承此平台
export { Weapp }

export interface IOptions {
  enablekeyboardAccessory?: boolean
}

export default (ctx: IPluginContext, options: IOptions) => {
  ctx.registerPlatform({
    name: 'weapp',
    useConfigName: 'mini',
    async fn ({ config }) {
      const program = new Weapp(ctx, config, options || {})
      await ctx.modifyAppConfig(({ appConfig }) => {
        const template = program.template
        let cursorColor = components.Input['cursor-color']
        if (appConfig.renderer === 'skyline') {
          cursorColor = "'#07c160'"
        }
        template.internalComponents = {
          ...template.internalComponents,
          Input: {
            ...template.internalComponents.Input,
            'cursor-color': cursorColor
          }
        }
      })
      await program.start()
    }
  })
}
