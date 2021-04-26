import * as path from 'path'
import * as fs from 'fs'
import * as MetroResolver from 'metro-resolver'
import * as ModuleResolution from 'metro/src/node-haste/DependencyGraph/ModuleResolution'
import { resolvePathFromAlias, resolveExtFile } from './utils'

interface VersionInfo {
  major: number;
  minor: number;
  patch: number;
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
    const packageInfo: any = JSON.parse(fs.readFileSync(path.join(rnBasePath, 'package.json'), 'utf8'))
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

/**
 * resolveRequest 文件处理，alias，文件后缀加载等
 */
function handleFile (context, realModuleName, platform, moduleName) {
  const savedOriginModulePath = context.originModulePath
  const savedAllowHaste = context.allowHaste
  if (moduleName.startsWith('@tarojs/')) {
    // 通过Haste去查找软链接模块
    context.allowHaste = true
  }

  // 处理 alias
  moduleName = resolvePathFromAlias(moduleName)

  // 处理后缀 .rn.ts
  moduleName = resolveExtFile(context, moduleName, platform)

  let res = null
  const savedResolveRequest = context.resolveRequest
  context.resolveRequest = null

  try {
    res = MetroResolver.resolve(context, moduleName, platform)
  } catch (ex) {
    // console.log(ex)
    // nothing to do
  } finally {
    context.originModulePath = savedOriginModulePath
    context.allowHaste = savedAllowHaste
    context.resolveRequest = savedResolveRequest
  }
  return res
}

// rn runner调用
function handleTaroFile (context, realModuleName, platform, moduleName) {
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

  // 处理 alias
  moduleName = resolvePathFromAlias(moduleName)

  // 处理后缀 .rn.ts
  moduleName = resolveExtFile(context, moduleName, platform)

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

export {
  handleFile,
  handleTaroFile,
  searchReactNativeModule,
  getReactNativeVersion
}
