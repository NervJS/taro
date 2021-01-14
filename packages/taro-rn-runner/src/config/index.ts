import * as Metro from 'metro'
import * as os from 'os'
import * as path from 'path'
import resolveReactNativePath from '@react-native-community/cli/build/tools/config/resolveReactNativePath'
import findProjectRoot from '@react-native-community/cli/build/tools/config/findProjectRoot'
import * as Supporter from '@tarojs/rn-supporter'
import ConditionalFileStore from './conditional-file-store'

const reactNativePath: string = resolveReactNativePath(findProjectRoot())

type ResolveRequestFunc = (context, realModuleName, platform, moduleName) => any
type GetModulesRunBeforeMainModuleFunc = () => any
type GetPolyfillsFunc = () => any
interface MetroConfig {
  transformer: {
    dynamicDepsInPackages: string;
    babelTransformerPath: string;
    assetRegistryPath: string;
  },
  resolver: {
    sourceExts: string[];
    resolveRequest?: ResolveRequestFunc;
  },
  serializer: {
    getModulesRunBeforeMainModule: GetModulesRunBeforeMainModuleFunc,
    getPolyfills: GetPolyfillsFunc
  },
  cacheStores: ConditionalFileStore<any>[]
}

const defaultConfig: MetroConfig = getDefaultConfig()

function getDefaultConfig () {
  const supporter = new Supporter({ fromRunner: true })
  const taroMetroConfig = supporter.getMetroConfig()
  const metroConfig: MetroConfig = {
    transformer: taroMetroConfig.transformer,
    resolver: taroMetroConfig.resolver,
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
    cacheStores: [new ConditionalFileStore<any>({
      root: path.join(os.tmpdir(), 'metro-cache')
    })]
  }
  return metroConfig
}

export default async (config: any) => {
  const metroConfig = getDefaultConfig()
  const res = await Metro.loadConfig({}, metroConfig)
  if (!res.cacheStores || (res.cacheStores.length !== 1) || !(res.cacheStores[0] instanceof ConditionalFileStore)) {
    throw new Error("cacheStores shouldn't be overridden in metro config.")
  }
  if (config.entry) {
    res.cacheStores[0].entryName = config.entry
  }
  return res
}

export { defaultConfig }
