import assetsPlugin from '../common/vite-plugin-assets'
import multiPlatformPlugin from '../common/vite-plugin-multi-platform'
import configPlugin from './config'
import emitPlugin from './emit'
import entryPlugin from './entry'
import nativeSupportPlugin from './native-support'
import pagePlugin from './page'
import pipelinePlugin from './pipeline'
import stylePlugin from './style'
import tabbarPlugin from './tabbar'

import type { ViteMiniCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export default function (viteCompilerContext: ViteMiniCompilerContext): PluginOption[] {
  return [
    pipelinePlugin(viteCompilerContext),
    configPlugin(viteCompilerContext),
    entryPlugin(viteCompilerContext),
    pagePlugin(viteCompilerContext),
    tabbarPlugin(viteCompilerContext),
    multiPlatformPlugin(viteCompilerContext),
    nativeSupportPlugin(viteCompilerContext),
    assetsPlugin(viteCompilerContext),
    stylePlugin(viteCompilerContext),
    emitPlugin(viteCompilerContext),
  ]
}
