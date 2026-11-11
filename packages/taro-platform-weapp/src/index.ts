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
      let originalCursorColor: string | undefined
      await ctx.modifyAppConfig(({ appConfig }) => {
        const template = program.template
        if (originalCursorColor === undefined) {
          originalCursorColor = template.internalComponents.Input['cursor-color']
        }
        let cursorColor = originalCursorColor
        if (appConfig.renderer === 'skyline') {
          cursorColor = "'#07c160'"
        }
        template.setInputCursorColor(cursorColor)
      })
      await program.start()
    }
  })
}
