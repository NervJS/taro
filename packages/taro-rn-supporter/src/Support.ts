import { Config } from './types/index'
import { getProjectConfig, handleFile } from './utils'

export class Supporter {
  config: Config

  constructor () {
    process.env.TARO_ENV = 'rn'
    this.config = getProjectConfig()
  }

  getTransformer () {
    return {
      babelTransformerPath: require.resolve('./taroTransformer'),
      assetRegistryPath: require.resolve('react-native/Libraries/Image/AssetRegistry', {
        paths: [process.cwd()]
      }),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false
        }
      })
    }
  }

  getResolver () {
    return {
      sourceExts: ['ts', 'tsx', 'js', 'jsx', 'scss', 'sass', 'less', 'css', 'pcss', 'json', 'styl', 'cjs'],
      resolveRequest: handleFile
    }
  }

  getMetroConfig () {
    return {
      transformer: this.getTransformer(),
      resolver: this.getResolver()
    }
  }
}
