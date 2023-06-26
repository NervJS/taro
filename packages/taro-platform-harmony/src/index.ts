/* eslint-disable no-console */
import { chalk } from '@tarojs/helper'
import path from 'path'

import HarmonyOS_ArkTS from './program/arkTS'
import HarmonyOS_JSUI from './program/jsUI'
import { PLATFORM_NAME } from './utils'

import type { IPluginContext } from '@tarojs/service'
import type { IHarmonyConfig } from '@tarojs/taro/types/compile'

// 让其它平台插件可以继承此平台
export { HarmonyOS_JSUI }

export interface IOptions {
  disableArkTS?: boolean
  useConfigName?: string
}

export default (ctx: IPluginContext, options: IOptions = {}) => {
  // 合并 harmony 编译配置到 opts
  ctx.modifyRunnerOpts(({ opts }) => {
    if (opts.platform !== PLATFORM_NAME) return

    const harmonyConfig = ctx.ctx.initialConfig.harmony
    assertHarmonyConfig(ctx, harmonyConfig)

    const { projectPath, hapName = 'entry', jsFAName = 'default' } = harmonyConfig
    opts.outputRoot = path.join(projectPath, hapName, 'src/main/ets', jsFAName)
    opts.harmony = {
      projectPath,
      hapName,
      jsFAName
    }
    ctx.paths.outputPath = opts.outputRoot
  })

  const Harmony = options.disableArkTS ? HarmonyOS_JSUI : HarmonyOS_ArkTS
  ctx.registerPlatform({
    name: PLATFORM_NAME,
    useConfigName: options.useConfigName || PLATFORM_NAME,
    async fn ({ config }) {
      const program = new Harmony(ctx, config)
      await program.start()
    }
  })
}

function assertHarmonyConfig (ctx: IPluginContext, config): asserts config is IHarmonyConfig {
  const NOTE_INVALID = chalk.red('[✗] ')
  const errorChalk = chalk.hex('#f00')
  const lineChalk = chalk.hex('#fff')

  function throwError (err) {
    console.log(errorChalk(`Taro 配置有误，请检查！ (${ctx.paths.configPath})`))
    console.log(`  ${NOTE_INVALID}${lineChalk(err)}`)
    process.exit(0)
  }

  if (typeof config !== 'object' || !config) {
    throwError('请设置 harmony 编译配置')
  }

  if (!config.projectPath) {
    throwError('请设置 harmony.projectPath')
  }
}
