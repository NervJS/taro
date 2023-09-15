import multiPlatformPlugin from '../common/multi-platform-plugin'
import configPlugin from './config'
import entryPlugin from './entry'
import pipelinePlugin from './pipeline'
import router from './router'

import type { ViteH5CompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export default function (viteCompilerContext: ViteH5CompilerContext): PluginOption[] {
  return [
    pipelinePlugin(viteCompilerContext),
    configPlugin(viteCompilerContext),
    router(viteCompilerContext),
    entryPlugin(viteCompilerContext),
    multiPlatformPlugin(viteCompilerContext),
  ]
}
