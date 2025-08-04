import { VITE_COMPILER_LABEL } from './constant'

import type { ViteH5CompilerContext, ViteHarmonyCompilerContext, ViteMiniCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginContext } from 'rollup'

export async function getViteH5CompilerContext (rollupPluginContext: PluginContext): Promise<ViteH5CompilerContext | void> {
  const info = process.env.NODE_ENV === 'production'
    ? rollupPluginContext.getModuleInfo(VITE_COMPILER_LABEL)
    : await rollupPluginContext.load({ id: VITE_COMPILER_LABEL })
  const compiler = info?.meta.viteCompilerContext
  return compiler
}

export async function getViteHarmonyCompilerContext (rollupPluginContext: PluginContext): Promise<ViteHarmonyCompilerContext | void> {
  const info = process.env.NODE_ENV === 'production'
    ? rollupPluginContext.getModuleInfo(VITE_COMPILER_LABEL)
    : await rollupPluginContext.load({ id: VITE_COMPILER_LABEL })
  const compiler = info?.meta.viteCompilerContext
  return compiler
}

export function getViteMiniCompilerContext (rollupPluginContext: PluginContext): ViteMiniCompilerContext | void {
  const info = rollupPluginContext.getModuleInfo(VITE_COMPILER_LABEL)
  const compiler = info?.meta.viteCompilerContext
  return compiler
}
