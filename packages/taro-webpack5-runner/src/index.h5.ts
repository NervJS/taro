import { chalk } from '@tarojs/helper'
import { runH5Build } from '@tarojs/runner-utils/bundler/runner'
import Prebundle from '@tarojs/webpack5-prebundle'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import { H5Combination } from './webpack/H5Combination'

import type { Configuration, Stats } from 'webpack'
import type { IH5BuildConfig } from './utils/types'

export default async function build (appPath: string, rawConfig: IH5BuildConfig): Promise<Stats | void> {
  const combination = new H5Combination(appPath, rawConfig)
  await combination.make()

  const { chunkDirectory = 'chunk', devServer, enableSourceMap, entryFileName = 'app', entry = {}, publicPath } = combination.config
  let prebundle: Prebundle | null = null
  if (!combination.isBuildNativeComp) {
    prebundle = new Prebundle({
      appPath,
      sourceRoot: combination.sourceRoot,
      chain: combination.chain,
      chunkDirectory,
      devServer,
      enableSourceMap,
      entryFileName,
      entry,
      isWatch: combination.config.isWatch,
      publicPath,
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
  }

  return runH5Build<Stats, Configuration, WebpackDevServer.Configuration>({
    appPath,
    config: combination.config,
    bundlerConfig: combination.chain.toConfig(),
    isBuildNativeComp: combination.isBuildNativeComp,
    createCompiler: cfg => webpack(cfg),
    createDevServer: (devServerOpts, compiler) => new WebpackDevServer(devServerOpts, compiler),
    onCompilerCreated: compiler => prebundle?.postCompilerStart(compiler)
  })
}
