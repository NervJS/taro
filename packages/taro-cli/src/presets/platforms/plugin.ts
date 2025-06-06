import * as path from 'node:path'

import { fs } from '@tarojs/helper'
import { getPlatformType } from '@tarojs/shared'

import type { IPluginContext } from '@tarojs/service'

const configName = 'mini'
export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'plugin',
    useConfigName: configName,
    async fn ({ config }) {
      const {
        options,
        _
      } = ctx.runOpts
      const { chalk, PLATFORMS } = ctx.helper
      const { ASCF, WEAPP, ALIPAY, JD } = PLATFORMS
      const typeMap = {
        [ASCF]: 'ASCF',
        [JD]: '京东',
        [WEAPP]: '微信',
        [ALIPAY]: '支付宝'
      }
      const { plugin, isWatch } = options
      if (plugin !== ASCF && plugin !== WEAPP && plugin !== ALIPAY && plugin !== JD) {
        console.log(chalk.red('目前插件编译仅支持 ASCF/微信/支付宝/京东 小程序！'))
        return
      }
      console.log(chalk.green(`开始编译${typeMap[plugin]}小程序插件`))
      async function buildPlugin (platform) {
        process.env.TARO_ENV = platform
        process.env.TARO_PLATFORM = getPlatformType(platform, configName)
        await ctx.applyPlugins({
          name: 'build',
          opts: {
            config: {
              ...config,
              isBuildPlugin: true,
              isWatch,
              outputRoot: `${config.outputRoot}/plugin`,
              platform
            },
            options: Object.assign({}, options, {
              platform
            }),
            _
          }
        })
        await ctx.applyPlugins({
          name: 'build',
          opts: {
            config: {
              ...config,
              isBuildPlugin: false,
              isWatch,
              outputRoot: `${config.outputRoot}/miniprogram`,
              platform,
              output: { ...(config.output || {}), clean: false }
            },
            options: Object.assign({}, options, {
              platform
            }),
            _
          }
        })
      }

      await buildPlugin(plugin)

      try {
        const docSrcPath = path.join(process.cwd(), 'src/plugin/doc')
        const docDestPath = path.join(process.cwd(), 'miniprogram/doc')
        fs.copy(docSrcPath, docDestPath)
      } catch (err) {
        console.error('[@tarojs/cli] build plugin doc failed: ', err)
      }
    }
  })
}
