import { getProjectConfig } from './utils'
import { handleFile, handleTaroFile, getReactNativeVersion, searchReactNativeModule } from './taroResolver'
interface Options{
  fromRunner: boolean // taro rn-runner内部调用
}
export class Supporter {
  fromRunner = false

  constructor (opt?: Options) {
    process.env.TARO_ENV = 'rn'
    getProjectConfig()
    if (opt?.fromRunner) {
      this.fromRunner = true
    }
  }

  getTransformer () {
    const transformerPath = this.fromRunner ? './taroTransformer' : './transformer'
    return {
      dynamicDepsInPackages: 'reject',
      babelTransformerPath: require.resolve(transformerPath),
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
    const handleEntryFile = this.fromRunner ? handleTaroFile : handleFile
    const resolver: any = {
      sourceExts: ['ts', 'tsx', 'js', 'jsx', 'scss', 'sass', 'less', 'css', 'pcss', 'json', 'styl', 'cjs'],
      resolveRequest: handleEntryFile
    }
    // 兼容0.60
    const rnVersion = getReactNativeVersion()
    if (rnVersion && (rnVersion.major === 0) && (rnVersion.minor === 60)) {
      resolver.resolveRequest = (context, realModuleName, platform, moduleName) => {
        const res = handleEntryFile(context, realModuleName, platform, moduleName)
        if (res) {
          return res
        }
        if (/node_modules[\\/]react-native[\\/]/.test(context.originModulePath)) {
          const existingModule = searchReactNativeModule(moduleName, platform)
          if (existingModule) {
            return {
              filePath: existingModule,
              type: 'sourceFile'
            }
          }
        }
      }
    }
    return resolver
  }

  getMetroConfig () {
    return {
      transformer: this.getTransformer(),
      resolver: this.getResolver()
    }
  }
}
