import { assetExts, emptyModulePath } from './defaults'
import { getReactNativeVersion, handleFile, handleTaroFile, searchReactNativeModule } from './taroResolver'
import { getProjectConfig, getRNConfig } from './utils'

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
      allowOptionalDependencies: true,
      asyncRequireModulePath: require.resolve('metro-runtime/src/modules/asyncRequire'),
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
    const rnConfig = getRNConfig()
    const handleEntryFile = this.fromRunner ? handleTaroFile : handleFile
    const resolver: any = {
      sourceExts: ['ts', 'tsx', 'js', 'jsx', 'scss', 'sass', 'less', 'css', 'pcss', 'json', 'styl', 'cjs', 'svgx'],
      resolveRequest: handleEntryFile,
      resolverMainFields: ['react-native', 'browser', 'main'],
      emptyModulePath
    }
    if (rnConfig.enableSvgTransform) {
      resolver.assetExts = assetExts.filter(ext => ext !== 'svg')
      resolver.sourceExts.push('svg')
    }
    // 兼容0.60
    const rnVersion = getReactNativeVersion()
    if (rnVersion && (rnVersion.major === 0) && (rnVersion.minor === 60)) {
      resolver.resolveRequest = (context, moduleName, platform) => {
        const res = handleEntryFile(context, moduleName, platform)
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
