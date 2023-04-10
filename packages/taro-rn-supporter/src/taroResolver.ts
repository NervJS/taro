import * as MetroSymlinksResolver from '@rnx-kit/metro-resolver-symlinks'
import * as fs from 'fs'
import * as path from 'path'

import { entryFilePath } from './defaults'
import { resolveExtFile, resolvePathFromAlias } from './utils'

import type { ResolutionContext } from 'metro-resolver'

const symlinksResolver = MetroSymlinksResolver()

interface VersionInfo {
  major: number
  minor: number
  patch: number
}

function getReactNativeBasePath (): string {
  const reactNativeModuleName = 'react-native'
  const rnBasePath = require.resolve(reactNativeModuleName)
  const splittings = rnBasePath.split(path.sep)
  const index = splittings.lastIndexOf(reactNativeModuleName)
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
 * metro 0.70 type ResolveRequestFunc = (context, moduleName, platform) => any
 */
function handleFile (context: ResolutionContext, moduleName, platform) {
  // 处理 alias
  moduleName = resolvePathFromAlias(moduleName)

  // 处理后缀 .rn.ts
  moduleName = resolveExtFile(context, moduleName, platform)
  return symlinksResolver(context, moduleName, platform)
}

// rn runner调用
function handleTaroFile (context: ResolutionContext, moduleName, platform) {
  const newContext = { ...context }
  if(context.originModulePath === require.resolve(entryFilePath)) {
    newContext.originModulePath = path.join(context.projectRoot, './index.js')
  }
  return handleFile(newContext, moduleName, platform)
}

export {
  getReactNativeVersion,
  handleFile,
  handleTaroFile,
  searchReactNativeModule
}
