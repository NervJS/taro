export async function getViteH5Compiler (rollupPluginContext) {
  const info = process.env.NODE_ENV === 'production' 
    ?
    rollupPluginContext.getModuleInfo('taro:compiler') 
    : 
    await rollupPluginContext.load({ id: 'taro:compiler' })
  const compiler = info?.meta.compiler
  return compiler
}