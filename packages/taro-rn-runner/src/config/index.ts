import * as Metro from 'metro'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import * as MetroResolver from 'metro-resolver'
import * as ModuleResolution from 'metro/src/node-haste/DependencyGraph/ModuleResolution'
import ConditionalFileStore from './conditional-file-store'

interface VersionInfo {
  major: number;
  minor: number;
  patch: number;
}

type ResolveRequestFunc = (context, realModuleName, platform, moduleName) => any
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
  cacheStores: ConditionalFileStore<any>[]
}

function getReactNativeBasePath (): string {
  const reactNativeModuleName = 'react-native'
  const rnBasePath = require.resolve(reactNativeModuleName)
  const splittings = rnBasePath.split(path.sep)
  const index = splittings.indexOf(reactNativeModuleName)
  return splittings.slice(0, index + 1).join(path.sep)
}

function getReactNativeVersion (): VersionInfo | null {
  const rnBasePath = getReactNativeBasePath()
  try {
    const packageInfo:any = JSON.parse(fs.readFileSync(path.join(rnBasePath, 'package.json'), 'utf8'))
    const splittings = packageInfo.version.split('.')
    const res: VersionInfo = {
      major: parseInt(splittings[0], 10),
      minor: parseInt(splittings[1], 10),
      patch: parseInt(splittings[2], 10)
    }
    return res
  } catch (ex) {
    console.log(ex)
    throw ex
  }
  return null
}

function searchReactNativeModule (moduleName: string, platform: string): string {
  const rnBasePath = getReactNativeBasePath()
  const baseModuleName = path.basename(moduleName, path.extname(moduleName))
  const queue: string[] = [path.join(rnBasePath, 'Libraries')]
  while (queue.length) {
    const pwd = queue.shift() || ''
    const ls: fs.Dirent[] = fs.readdirSync(pwd, {
      encoding: 'utf8',
      withFileTypes: true
    })
    for (const dirItem of ls) {
      if (dirItem.isDirectory()) {
        queue.push(path.join(pwd, dirItem.name))
      } else if (dirItem.isFile()) {
        if ([baseModuleName, `${baseModuleName}.${platform}`].indexOf(path.basename(dirItem.name, path.extname(dirItem.name))) > -1) {
          return path.join(pwd, dirItem.name)
        }
      }
    }
  }
  return ''
}

function handleEntryFile (context, realModuleName, platform, moduleName) {
  if (moduleName === './index') {
    return {
      filePath: realModuleName,
      type: 'empty'
    }
  }
  const savedOriginModulePath = context.originModulePath
  if ((savedOriginModulePath === ModuleResolution.ModuleResolver.EMPTY_MODULE) && moduleName.startsWith('./')) {
    context.originModulePath = path.join(context.projectRoot, './index')
  }
  const savedAllowHaste = context.allowHaste
  if (moduleName.startsWith('@tarojs/')) {
    // 通过Haste去查找软链接模块
    context.allowHaste = true
  }
  let res = null
  const savedResolveRequest = context.resolveRequest
  context.resolveRequest = null

  try {
    res = MetroResolver.resolve(context, moduleName, platform)
  } catch (ex) {
    // nothing to do
  } finally {
    context.originModulePath = savedOriginModulePath
    context.allowHaste = savedAllowHaste
    context.resolveRequest = savedResolveRequest
  }
  return res
}

const defaultConfig:MetroConfig = {
  transformer: {
    dynamicDepsInPackages: 'reject',
    babelTransformerPath: require.resolve('./taro-transformer'),
    assetRegistryPath: require.resolve('react-native/Libraries/Image/AssetRegistry', {
      paths: [process.cwd()]
    })
  },
  resolver: {
    sourceExts: ['ts', 'tsx', 'js', 'jsx', 'scss', 'sass', 'less', 'css', 'pcss', 'json', 'styl', 'cjs']
  },
  cacheStores: [new ConditionalFileStore<any>({
    root: path.join(os.tmpdir(), 'metro-cache')
  })]
}

// 兼容react-native 0.60
const rnVersion = getReactNativeVersion()
if (rnVersion && (rnVersion.major === 0) && (rnVersion.minor === 60)) {
  defaultConfig.resolver.resolveRequest = (context, realModuleName, platform, moduleName) => {
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
} else {
  defaultConfig.resolver.resolveRequest = handleEntryFile
}

export default async (config: any) => {
  const res = await Metro.loadConfig({}, defaultConfig)
  if (!res.cacheStores || (res.cacheStores.length !== 1) || !(res.cacheStores[0] instanceof ConditionalFileStore)) {
    throw new Error("cacheStores shouldn't be overridden in metro config.")
  }
  if (config.entry) {
    res.cacheStores[0].entryName = config.entry
  }
  return res
}

export { defaultConfig }
