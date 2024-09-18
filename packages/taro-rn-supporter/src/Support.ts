import * as os from 'node:os'
import * as path from 'node:path'

import resolveReactNativePath from '@react-native-community/cli-config/build/resolveReactNativePath'
import { findProjectRoot } from '@react-native-community/cli-tools'
import { mergeConfig, MetroConfig } from 'metro'

import { ConditionalFileStore } from './conditional-file-store'
import { assetExts } from './defaults'
import { getReactNativeVersion, handleFile, handleTaroFile, searchReactNativeModule } from './taroResolver'
import { getBlockList, getProjectConfig } from './utils'

import type { IProjectConfig } from '@tarojs/taro/types/compile'

const reactNativePath: string = resolveReactNativePath(findProjectRoot())

interface Options {
  fromRunner?: boolean // taro rn-runner内部调用，默认为 true
  qr?: boolean // 是否展示二维码，默认为 true
}

process.env.TARO_ENV = 'rn'

export function getTransformer (opt: Options = {}) {
  const transformerPath = (opt.fromRunner ?? true) ? './taroTransformer' : './transformer'
  const transform:any = {
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
        inlineRequires: true
      }
    })
  }
  if (process.env.PUBLIC_PATH) {
    transform.publicPath = process.env.PUBLIC_PATH
  }
  return transform
}

export function getResolver (opt: Options = {}, config: IProjectConfig, resolveRequest?: any) {
  const blockList = getBlockList(config)
  const handleEntryFile = (opt.fromRunner ?? true) ? handleTaroFile : handleFile
  const resolver: any = {
    sourceExts: ['ts', 'tsx', 'js', 'jsx', 'scss', 'sass', 'less', 'css', 'pcss', 'json', 'styl', 'cjs', 'svgx'],
    resolveRequest: (context, moduleName, platform) => {
      return handleEntryFile(context, moduleName, platform, config, resolveRequest)
    },
    resolverMainFields: ['react-native', 'browser', 'main'],
  }
  if (config?.rn?.enableSvgTransform) {
    resolver.assetExts = assetExts.filter(ext => ext !== 'svg')
    resolver.sourceExts.push('svg')
  }
  if (blockList.length > 0) {
    resolver.blockList = blockList
  }
  // 兼容0.60
  const rnVersion = getReactNativeVersion()
  if (rnVersion && (rnVersion.major === 0) && (rnVersion.minor === 60)) {
    resolver.resolveRequest = (context, moduleName, platform) => {
      const res = handleEntryFile(context, moduleName, platform, config)
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

interface ShareObject {
  sourceRoot: string
  qr: boolean
  entry: string
  cacheStore: any
  metroServerInstance: any
  port?: number
}
export const shareObject:ShareObject = {
  sourceRoot: 'src',
  qr: false,
  entry: 'app',
  cacheStore: null,
  metroServerInstance: null
}

export async function getMetroConfig (opt: Options = {}, toMergeConfig?: MetroConfig): Promise<MetroConfig> {
  const config = await getProjectConfig()
  const rnConfig = config.rn || {}
  const entry = rnConfig?.entry || 'app'
  const cacheStore = new ConditionalFileStore<any>({
    root: path.join(os.tmpdir(), 'metro-cache')
  }, entry)
  shareObject.sourceRoot = config.sourceRoot || 'src'
  shareObject.qr = opt.qr ?? false
  shareObject.entry = entry
  shareObject.cacheStore = cacheStore
  const taroMetroConfig = {
    transformer: getTransformer(opt),
    resolver: getResolver(opt, config, toMergeConfig?.resolver?.resolveRequest),
    serializer: {
      // We can include multiple copies of InitializeCore here because metro will
      // only add ones that are already part of the bundle
      getModulesRunBeforeMainModule: () => [
        require.resolve(
          path.join(reactNativePath, 'Libraries/Core/InitializeCore')
        )
      ],
      getPolyfills: () =>
        require(path.join(reactNativePath, 'rn-get-polyfills'))()
    },
    cacheStores: [cacheStore],
    server: {
      enhanceMiddleware: (Middleware, Server) => {
        shareObject.metroServerInstance = Server
        // @ts-ignore
        shareObject.port = Server._config.server.port
        return Middleware
      }
    },
  }
  if (!toMergeConfig) return taroMetroConfig

  const blockListTaro = taroMetroConfig.resolver?.blockList
  const blockListMerge = toMergeConfig.resolver?.blockList

  const finalConfig = mergeConfig(taroMetroConfig, toMergeConfig, {
    resolver: {
      blockList: [
        ...(blockListTaro instanceof RegExp ? [blockListTaro] : blockListTaro || []),
        ...(blockListMerge instanceof RegExp ? [blockListMerge] : blockListMerge || []),
      ],
      resolveRequest: taroMetroConfig.resolver?.resolveRequest,
    }
  })
  return finalConfig
}
