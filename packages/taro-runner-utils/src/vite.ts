import { VITE_COMPILER_LABEL } from './constant'

export async function getViteH5Compiler (rollupPluginContext) {
  const info = process.env.NODE_ENV === 'production' 
    ?
    rollupPluginContext.getModuleInfo(VITE_COMPILER_LABEL) 
    : 
    await rollupPluginContext.load({ id: VITE_COMPILER_LABEL })
  const compiler = info?.meta.compiler
  return compiler
}

export function getViteMiniCompiler (rollupPluginContext) {
  const info = rollupPluginContext.getModuleInfo(VITE_COMPILER_LABEL)
  const compiler = info?.meta.compiler
  return compiler
}