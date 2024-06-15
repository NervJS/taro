import { RawSource } from 'webpack-sources'

import TT from './program'

import type { IPluginContext } from '@tarojs/service'

// 让其它平台插件可以继承此平台
export { TT }

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'tt',
    useConfigName: 'mini',
    async fn ({ config }) {
      const extPages: string[] = []
      await ctx.modifyAppConfig(({ appConfig }) => {
        if (appConfig.pages) {
          appConfig.pages = appConfig.pages.map(page => {
            if (!page.startsWith('ext://')) {
              return page
            }
            if (!extPages.includes(page)) {
              extPages.push(page)
            }
          }).filter(Boolean) as string[]
        }
      })
      if (extPages.length > 0) {
        await ctx.modifyBuildAssets(({ assets }) => {
          const appJSON = assets['app.json']
          if (appJSON) {
            const appJSONContent = JSON.parse(appJSON.source())
            appJSONContent.pages = appJSONContent.pages.concat(extPages)
            assets['app.json'] = new RawSource(JSON.stringify(appJSONContent, null, 2))
          }
        })
      }
      const program = new TT(ctx, config)
      await program.start()
    }
  })
}
