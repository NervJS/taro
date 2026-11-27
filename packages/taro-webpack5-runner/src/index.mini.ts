import { chalk } from '@tarojs/helper'
import { runMiniBuild } from '@tarojs/runner-utils/bundler/runner'
import Prebundle from '@tarojs/webpack5-prebundle'
import webpack from 'webpack'

import { MiniCombination } from './webpack/MiniCombination'

import type { Configuration, Stats } from 'webpack'
import type { IMiniBuildConfig } from './utils/types'

export default async function build (appPath: string, rawConfig: IMiniBuildConfig): Promise<Stats | void> {
  const combination = new MiniCombination(appPath, rawConfig)
  await combination.make()

  const { enableSourceMap, entry = {}, runtimePath } = combination.config
  const prebundle = new Prebundle({
    appPath,
    sourceRoot: combination.sourceRoot,
    chain: combination.chain,
    enableSourceMap,
    entry,
    isWatch: combination.config.isWatch,
    runtimePath,
    isBuildPlugin: combination.isBuildPlugin,
    alias: combination.config.alias,
    defineConstants: combination.config.defineConstants,
    modifyAppConfig: combination.config.modifyAppConfig
  })
  try {
    await prebundle.run(combination.getPrebundleOptions())
  } catch (error) {
    console.error(error)
    console.warn(chalk.yellow('依赖预编译失败，已经为您跳过预编译步骤，但是编译速度可能会受到影响。'))
  }

  return runMiniBuild<Stats, Configuration>({
    config: combination.config,
    bundlerConfig: combination.chain.toConfig(),
    createCompiler: cfg => webpack(cfg)
  })
}
