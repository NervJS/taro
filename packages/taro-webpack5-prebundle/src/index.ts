import BasePrebundle, { IPrebundleConfig } from './prebundle'

export * from './prebundle'

export class TaroPrebundle {
  constructor (public env: string = process.env.TARO_ENV || 'h5') {
    this.env = env
  }

  async run (combination) {
    const options = combination.getPrebundleOptions()
    if (!options.enable) return

    let prebundleRunner: BasePrebundle

    const { appPath, chain, config = {}, sourceRoot } = combination
    const { chunkDirectory = 'chunk', devServer, enableSourceMap, entryFileName = 'app', entry = {}, publicPath, runtimePath } = config
    const prebundleConfig: IPrebundleConfig = {
      appPath,
      chain,
      chunkDirectory,
      enableSourceMap,
      entry,
      entryFileName,
      env: this.env,
      sourceRoot
    }

    switch (this.env) {
      case 'h5':
        prebundleRunner = new (await import('./h5')).H5Prebundle({
          ...prebundleConfig,
          devServer,
          publicPath
        }, options)
        break
      default:
        prebundleRunner = new (await import('./mini')).MiniPrebundle({
          ...prebundleConfig,
          runtimePath
        }, options)
    }

    return prebundleRunner.run()
  }
}

export default new TaroPrebundle()
