import BasePrebundle, { IPrebundleConfig } from './prebundle'

export * from './prebundle'

export class TaroPrebundle {
  constructor (public env: string = process.env.TARO_ENV || 'h5') {
    this.env = env
  }

  async run (combination) {
    const options = combination.getPrebundleOptions()
    if (!options.enable) return

    let Prebundle: typeof BasePrebundle

    const { appPath, chain, config = {}, sourceRoot } = combination
    const { chunkDirectory = 'chunk', devServer, enableSourceMap, entryFileName = 'app', entry = {}, publicPath, runtimePath } = config
    const prebundleConfig: IPrebundleConfig & Record<string, unknown> = {
      appPath,
      chain,
      chunkDirectory,
      enableSourceMap,
      entry,
      entryFileName,
      sourceRoot
    }

    switch (this.env) {
      case 'h5':
        Prebundle = (await import('./h5')).default as typeof BasePrebundle
        prebundleConfig.devServer = devServer
        prebundleConfig.publicPath = publicPath
        break
      default:
        Prebundle = (await import('./mini')).default as typeof BasePrebundle
        prebundleConfig.runtimePath = runtimePath
    }

    return new Prebundle(prebundleConfig, options)
  }
}

export default new TaroPrebundle()
