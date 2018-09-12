import { BuildConfig, TaroBaseConfig } from '../util/types';

export default ({
  sourceRoot = 'src',
  outputRoot = 'dist',
  publicPath = '/',
  staticDirectory = 'static',
  chunkDirectory = 'chunk',
  port = 10086,
  host = '0.0.0.0',
  https = false,
  designWidth = 750
}: BuildConfig): TaroBaseConfig => {
  return {
    sourceRoot,
    outputRoot,
    publicPath,
    staticDirectory,
    chunkDirectory,
    designWidth,
    port,
    host,
    https
  }
}
