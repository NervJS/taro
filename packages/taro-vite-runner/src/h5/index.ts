import multiPlatformPlugin from '../common/multi-platform-plugin'
import configPlugin from './config'
import entryPlugin from './entry'
import pipelinePlugin from './pipeline'
import router from './router'

import type { TaroCompiler } from 'src/utils/compiler/h5'
import type { PluginOption } from 'vite'

export default function (compiler: TaroCompiler): PluginOption[] {
  return [
    pipelinePlugin(compiler),
    configPlugin(compiler),
    router(compiler),
    entryPlugin(compiler),
    multiPlatformPlugin(compiler),
  ]
}
