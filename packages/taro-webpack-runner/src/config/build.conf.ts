import { BuildConfig, TaroBaseConfig } from '../util/types';

export default ({
  sourceRoot = 'src',
  outputRoot = 'dist',
  publicPath = '/',
  staticDirectory = 'static',
  chunkDirectory = 'chunk',
  designWidth = 750
}: BuildConfig): TaroBaseConfig => {
  return {
    sourceRoot,
    outputRoot,
    publicPath,
    staticDirectory,
    chunkDirectory,
    designWidth
  }
}
