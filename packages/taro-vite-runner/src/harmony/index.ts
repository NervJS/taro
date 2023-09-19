import multiPlatformPlugin from '../common/multi-platform-plugin'
import importPlugin from './babel'
import configPlugin from './config'
import emitPlugin from './emit'
import entryPlugin from './entry'
import etsPlugin from './ets'
import pagePlugin from './page'
import pipelinePlugin from './pipeline'

import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export default function (viteCompilerContext: ViteHarmonyCompilerContext): PluginOption[] {
  return [
    pipelinePlugin(viteCompilerContext),
    configPlugin(viteCompilerContext),
    entryPlugin(viteCompilerContext),
    pagePlugin(viteCompilerContext),
    etsPlugin(viteCompilerContext),
    multiPlatformPlugin(viteCompilerContext),
    emitPlugin(viteCompilerContext),
    importPlugin(viteCompilerContext)
  ]
}
