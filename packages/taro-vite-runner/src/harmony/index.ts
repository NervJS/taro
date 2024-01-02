import multiPlatformPlugin from '../common/multi-platform-plugin'
import { assetPlugin } from './asset'
import importPlugin from './babel'
import { compileModePrePlugin } from './compile'
import configPlugin from './config'
import emitPlugin from './emit'
import entryPlugin from './entry'
import etsPlugin from './ets'
import pagePlugin from './page'
import pipelinePlugin from './pipeline'
import { stylePlugin, stylePostPlugin } from './style'

import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { UserConfig } from 'vite'

export default function (viteCompilerContext: ViteHarmonyCompilerContext): UserConfig['plugins'] {
  return [
    pipelinePlugin(viteCompilerContext),
    configPlugin(viteCompilerContext),
    stylePlugin(viteCompilerContext),
    compileModePrePlugin(viteCompilerContext),
    assetPlugin(viteCompilerContext),
    entryPlugin(viteCompilerContext),
    pagePlugin(viteCompilerContext),
    etsPlugin(viteCompilerContext),
    multiPlatformPlugin(viteCompilerContext),
    emitPlugin(viteCompilerContext),
    importPlugin(viteCompilerContext),
    stylePostPlugin(viteCompilerContext),
  ]
}
