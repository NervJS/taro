import { VITE_COMPILER_LABEL } from './constant'

import type { ViteCompilerContext, ViteH5CompilerContext, ViteHarmonyCompilerContext, ViteMiniCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginContext } from 'rollup'

export async function getViteH5CompilerContext<T extends ViteCompilerContext<unknown> = ViteH5CompilerContext> (
  rollupPluginContext: PluginContext
): Promise<T | void> {
  const info = process.env.NODE_ENV === 'production'
    ? rollupPluginContext.getModuleInfo(VITE_COMPILER_LABEL)
    : await rollupPluginContext.load({ id: VITE_COMPILER_LABEL })
  const compiler = info?.meta.viteCompilerContext
  return compiler
}

export function getViteHarmonyCompilerContext<T extends ViteCompilerContext<unknown> = ViteHarmonyCompilerContext> (
  rollupPluginContext: PluginContext
): T | void {
  const info = rollupPluginContext.getModuleInfo(VITE_COMPILER_LABEL)
  const compiler = info?.meta.viteCompilerContext
  return compiler
}

export function getViteMiniCompilerContext<T extends ViteCompilerContext<unknown> = ViteMiniCompilerContext> (
  rollupPluginContext: PluginContext
): T | void {
  const info = rollupPluginContext.getModuleInfo(VITE_COMPILER_LABEL)
  const compiler = info?.meta.viteCompilerContext
  return compiler
}
