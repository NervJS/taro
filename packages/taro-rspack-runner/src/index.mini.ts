import { rspack } from '@rspack/core'
import { runMiniBuild } from '@tarojs/runner-utils/bundler/runner'

import { MiniCombination } from './rspack/mini'

import type { Configuration, Stats } from '@rspack/core'
import type { IMiniBuildConfig } from './utils/rspack'

export default async function build (appPath: string, rawConfig: IMiniBuildConfig): Promise<Stats | void> {
  const combination = new MiniCombination(appPath, rawConfig)
  await combination.make()

  return runMiniBuild<Stats, Configuration>({
    config: combination.config,
    bundlerConfig: combination.chain.toConfig() as Configuration,
    createCompiler: cfg => rspack(cfg)
  })
}
