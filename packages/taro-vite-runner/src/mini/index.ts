import multiPlatformPlugin from '../common/multi-platform-plugin'
import { TaroCompiler } from '../utils/compiler/mini'
import assetsPlugin from './assets'
import configPlugin from './config'
import emitPlugin from './emit'
import entryPlugin from './entry'
import nativeSupportPlugin from './native-support'
import pagePlugin from './page'
import pipelinePlugin from './pipeline'
import stylePlugin from './style'

import type { PluginOption } from 'vite'

export default function (compiler: TaroCompiler): PluginOption[] {
  return [
    pipelinePlugin(compiler),
    configPlugin(compiler),
    entryPlugin(compiler),
    pagePlugin(compiler),
    multiPlatformPlugin(compiler),
    nativeSupportPlugin(compiler),
    assetsPlugin(compiler),
    stylePlugin(compiler),
    emitPlugin(compiler),
  ]
}
