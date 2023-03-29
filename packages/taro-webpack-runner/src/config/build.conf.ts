import { BuildConfig } from '../utils/types'

export default ({
  sourceRoot = 'src',
  outputRoot = 'dist',
  publicPath = '/',
  staticDirectory = 'static',
  chunkDirectory = 'chunk',
  designWidth = 750,
  ...rest
}: BuildConfig): Partial<BuildConfig> => {
  return {
    sourceRoot,
    outputRoot,
    publicPath,
    staticDirectory,
    chunkDirectory,
    designWidth,
    ...rest
  }
}
