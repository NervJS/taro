import multiPlatformPlugin from '../common/multi-platform-plugin'
import importPlugin from './babel'
import configPlugin from './config'
import emitPlugin from './emit'
import entryPlugin from './entry'
import etsPlugin from './ets'
import pagePlugin from './page'
import pipelinePlugin from './pipeline'

import type { PluginOption } from 'vite'
import type { TaroCompiler } from '../utils/compiler/harmony'

export default function (compiler: TaroCompiler): PluginOption[] {
  return [
    pipelinePlugin(compiler),
    configPlugin(compiler),
    entryPlugin(compiler),
    pagePlugin(compiler),
    etsPlugin(compiler),
    multiPlatformPlugin(compiler),
    emitPlugin(compiler),
    importPlugin(compiler)
  ]
}
