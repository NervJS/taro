/* eslint-disable no-console */
import path from 'node:path'

import { chalk } from '@tarojs/helper'
import { DEFAULT_TERSER_OPTIONS } from '@tarojs/vite-runner/dist/utils/constants'

import initCommands from './commands'
import HarmonyCPP from './program'
import { CPP_LIBRARY_NAME, CPP_LIBRARY_PATH, getProcessArg, PLATFORM_NAME } from './utils'
import { PKG_DEPENDENCIES, PKG_NAME, PKG_VERSION, PROJECT_DEPENDENCIES_NAME } from './utils/constant'

import type { IPluginContext } from '@tarojs/service'
import type { IHarmonyConfig } from '@tarojs/taro/types/compile'

const argProjectPath = getProcessArg('lib')

export interface IOptions {
  useConfigName?: string
  /** @default false */
  useChoreLibrary?: boolean
}

export default (ctx: IPluginContext, options: IOptions = {}) => {
  // 合并 harmony 编译配置到 opts
  ctx.modifyRunnerOpts(({ opts }) => {
    if (opts.platform !== PLATFORM_NAME) return

    opts.ohPackage ||= {}
    opts.ohPackage.dependencies ||= {}

    if (options.useChoreLibrary) {
      opts.chorePackagePrefix ||= `${PKG_NAME}/src/main/ets/npm`
      opts.ohPackage.dependencies[PKG_NAME] ||= `^${PKG_VERSION}`
      PROJECT_DEPENDENCIES_NAME.forEach(key => {
        opts.ohPackage.dependencies[key] ||= PKG_DEPENDENCIES[key]
      })
    } else {
      Object.keys(PKG_DEPENDENCIES).forEach(key => {
        opts.ohPackage.dependencies[key] ||= PKG_DEPENDENCIES[key]
      })
      opts.ohPackage.dependencies[CPP_LIBRARY_NAME] = CPP_LIBRARY_PATH
    }
    const harmonyConfig = ctx.ctx.initialConfig.harmony
    assertHarmonyConfig(ctx, harmonyConfig)

    const terserOptions = harmonyConfig?.terser || ctx.initialConfig.terser || { config: DEFAULT_TERSER_OPTIONS }
    terserOptions.config ||= {}
    terserOptions.config.output ||= {}
    terserOptions.config.output.comments ||= /^!/ // Note: 避免删除第一行注释影响 rawfile 代码缓存

    harmonyConfig.name ||= 'default'
    harmonyConfig.hapName ||= 'entry'
    const { projectPath, hapName } = harmonyConfig

    if (ctx.runOpts?.options?.args?.onlyBundle) {
      opts.outputRoot = path.join(argProjectPath || projectPath)
    } else {
      opts.outputRoot = path.join(argProjectPath || projectPath, hapName, 'src/main', 'ets')
    }
    opts.harmony = harmonyConfig

    ctx.paths.outputPath = opts.outputRoot
  })

  initCommands(ctx, options)
  ctx.registerPlatform({
    name: PLATFORM_NAME,
    useConfigName: options.useConfigName || 'harmony',
    async fn ({ config }) {
      const program = new HarmonyCPP(ctx, config, options)
      await program.start()

      if (options.useChoreLibrary === false) {
        // Note: 注入 C-API 库
      }
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
