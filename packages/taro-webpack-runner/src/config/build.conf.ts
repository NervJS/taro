import { BuildConfig } from '../util/types';

export default ({
  sourceRoot = 'src',
  outputRoot = 'dist',
  publicPath = '/',
  staticDirectory = 'static',
  chunkDirectory = 'chunk',
  designWidth = 750
}: BuildConfig): Partial<BuildConfig> => {
  return {
    sourceRoot,
    outputRoot,
    publicPath,
    staticDirectory,
    chunkDirectory,
    designWidth
  }
}
