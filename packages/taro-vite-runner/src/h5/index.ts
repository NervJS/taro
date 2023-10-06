import assets from '../common/assets'
import multiPlatformPlugin from '../common/multi-platform-plugin'
import { getMode } from '../utils'
import configPlugin from './config'
import entryPlugin from './entry'
import es5Plugin from './es5'
import mpa from './mpa'
import pipelinePlugin from './pipeline'
import router from './router'

import type { ViteH5CompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export default function (viteCompilerContext: ViteH5CompilerContext): PluginOption[] {
  const { taroConfig } = viteCompilerContext
  const { es5 } = taroConfig
  const isMultiRouterMode = taroConfig.router?.mode === 'multi'
  const isProd = getMode(taroConfig) === 'production'

  const preset = [ 
    pipelinePlugin(viteCompilerContext),
    configPlugin(viteCompilerContext),
    router(viteCompilerContext),
    entryPlugin(viteCompilerContext),
    multiPlatformPlugin(viteCompilerContext)
  ]

  if (es5 && isProd) preset.push(es5Plugin(viteCompilerContext))

  if (isMultiRouterMode) preset.push(mpa(viteCompilerContext))

  if (isProd) preset.push(assets(viteCompilerContext))

  return preset
}
