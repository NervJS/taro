import { getMode } from 'src/utils'

import multiPlatformPlugin from '../common/multi-platform-plugin'
import assets from './assets'
import configPlugin from './config'
import entryPlugin from './entry'
import mpa from './mpa'
import pipelinePlugin from './pipeline'
import router from './router'

import type { ViteH5CompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export default function (viteCompilerContext: ViteH5CompilerContext): PluginOption[] {
  const { taroConfig } = viteCompilerContext
  const isMultiRouterMode = taroConfig.router?.mode === 'multi'
  const isProd = getMode(taroConfig)

  const preset = [ 
    pipelinePlugin(viteCompilerContext),
    configPlugin(viteCompilerContext),
    router(viteCompilerContext),
    entryPlugin(viteCompilerContext),
    multiPlatformPlugin(viteCompilerContext)
  ]

  if (isMultiRouterMode) preset.push(mpa(viteCompilerContext))

  if (isProd) preset.push(assets(viteCompilerContext))

  return preset
}
