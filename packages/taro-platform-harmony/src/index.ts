/* eslint-disable no-console */
import { chalk } from '@tarojs/helper'
import path from 'path'

import Harmony from './program'

import type { IPluginContext } from '@tarojs/service'

// 让其它平台插件可以继承此平台
export { Harmony }

interface HarmonyConfig {
  projectPath: string
  hapName?: string
  jsFAName?: string
}

const HARMONY = 'harmony'

export default (ctx: IPluginContext) => {
  // 合并 harmony 编译配置到 opts
  ctx.modifyRunnerOpts(({ opts }) => {
    if (opts.platform !== HARMONY) return

    const harmonyConfig = ctx.ctx.initialConfig.harmony
    assertHarmonyConfig(ctx, harmonyConfig)

    const { projectPath, hapName = 'entry', jsFAName = 'default' } = harmonyConfig
    opts.outputRoot = path.join(projectPath, hapName, 'src/main/js', jsFAName)
    opts.harmony = {
      projectPath,
      hapName,
      jsFAName
    }
    ctx.paths.outputPath = opts.outputRoot
  })

  ctx.registerPlatform({
    name: HARMONY,
    useConfigName: 'mini',
    async fn ({ config }) {
      const program = new Harmony(ctx, config)
      await program.start()
    }
  })
}

function assertHarmonyConfig (ctx: IPluginContext, config): asserts config is HarmonyConfig {
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
