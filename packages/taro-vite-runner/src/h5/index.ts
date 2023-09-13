import multiPlatformPlugin from '../common/multi-platform-plugin'
import assetsPlugin from './assets'
import configPlugin from './config'
import entryPlugin from './entry'
import mpaPlugin from './mpa'
import pipelinePlugin from './pipeline'

import type { TaroCompiler } from 'src/utils/compiler/h5'
import type { PluginOption } from 'vite'

export default function (compiler: TaroCompiler): PluginOption[] {
  return [
    pipelinePlugin(compiler),
    configPlugin(compiler),
    entryPlugin(compiler),
    mpaPlugin(compiler),
    multiPlatformPlugin(compiler),
    assetsPlugin(compiler),
  ]
}
