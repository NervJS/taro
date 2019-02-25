import * as path from 'path'

import { resolveNpmFilesPath } from './resolve_npm_files'
import { INpmConfig } from './types'
import { BUILD_TYPES, REG_STYLE, NODE_MODULES } from './constants'
import { promoteRelativePath, recursiveFindNodeModules } from './index'

interface IArgs {
  npmName: string,
  filePath: string,
  isProduction: boolean,
  npmConfig: INpmConfig,
  buildAdapter: BUILD_TYPES,
  npmOutputDir: string,
  compileInclude: string[]
}
const appPath = process.cwd()
const notExistNpmList: Set<string> = new Set()
const nodeModulesPath = recursiveFindNodeModules(path.join(appPath, NODE_MODULES))

export function getNpmOutputDir (outputDir: string, configDir: string, npmConfig: INpmConfig): string {
  let npmOutputDir
  if (!npmConfig.dir) {
    npmOutputDir = path.join(outputDir, npmConfig.name)
  } else {
    npmOutputDir = path.join(path.resolve(configDir, '..', npmConfig.dir), npmConfig.name)
  }
  return npmOutputDir
}

export function getExactedNpmFilePath ({
  npmName,
  filePath,
  isProduction,
  npmConfig,
  buildAdapter,
  npmOutputDir,
  compileInclude
}: IArgs) {
  try {
    const npmInfo = resolveNpmFilesPath(npmName, isProduction, npmConfig, buildAdapter, appPath, compileInclude)
    const npmInfoMainPath = npmInfo.main
    let outputNpmPath
    if (REG_STYLE.test(npmInfoMainPath)) {
      outputNpmPath = npmInfoMainPath
    } else {
      outputNpmPath = npmInfoMainPath.replace(nodeModulesPath, npmOutputDir)
    }
    if (buildAdapter === BUILD_TYPES.ALIPAY) {
      outputNpmPath = outputNpmPath.replace(/@/g, '_')
    }
    const relativePath = path.relative(filePath, outputNpmPath)
    return promoteRelativePath(relativePath)
  } catch (err) {
    console.log(err)
    notExistNpmList.add(npmName)
    return npmName
  }
}

export function getNotExistNpmList () {
  return notExistNpmList
}

export function getNodeModulesPath (): string {
  return nodeModulesPath
}
