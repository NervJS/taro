import path from 'node:path'

import { normalizePath, promoteRelativePath, readConfig, resolveMainFilePath } from '@tarojs/helper'
import { isArray, isFunction, isString } from '@tarojs/shared'

import type { AppConfig, SubPackage } from '@tarojs/taro'
import type { IBundlerSources } from './types'

export const SUB_COMMON_DIR = 'sub-common'
export const SUB_VENDORS_NAME = 'sub-vendors'

export interface ISubCommonDepInfo {
  identifier: string
  resource: string
  chunks: Set<string>
  rawIdentifier?: string
}

export function formatSubRoot (subRoot: string): string {
  return subRoot.endsWith('/') ? subRoot.slice(0, -1) : subRoot
}

export function extractMiniAppEntryPath (entry: any): string {
  if (!entry || isFunction(entry)) {
    return ''
  }
  const app = entry.app
  if (!app) {
    return ''
  }
  if (Array.isArray(app)) {
    return app[0]
  }
  if (Array.isArray(app.import)) {
    return app.import[0]
  }
  return typeof app === 'string' ? app : ''
}

export function loadMiniSubPackages (
  entry: any,
  config: Record<string, any>
): { subPackages: SubPackage[], subRoots: string[], subRootRegExps: RegExp[] } {
  const appEntry = extractMiniAppEntryPath(entry)
  if (!appEntry) {
    return { subPackages: [], subRoots: [], subRootRegExps: [] }
  }

  const appConfigPath = resolveMainFilePath(`${appEntry.replace(path.extname(appEntry), '')}.config`)
  const appConfig: AppConfig = readConfig(appConfigPath, config)
  const rawSubPackages = appConfig?.subPackages || appConfig?.subpackages || []
  const subPackages = rawSubPackages
    .filter((subPackage: SubPackage) => !subPackage.independent)
    .map((subPackage: SubPackage) => ({
      ...subPackage,
      root: formatSubRoot(subPackage.root)
    }))
  const subRoots = subPackages.map(sp => sp.root)
  const subRootRegExps = subRoots.map(subRoot => new RegExp(`^${subRoot}\\/`))
  return { subPackages, subRoots, subRootRegExps }
}

export function buildSubCommonChunksMap (
  subCommonDeps: Map<string, ISubCommonDepInfo>
): Map<string, Set<string>> {
  const subCommonChunks = new Map<string, Set<string>>()
  subCommonDeps.forEach((depInfo, depName) => {
    const resolvedDepName = depInfo.rawIdentifier?.startsWith('xml/compile-mode')
      ? `${depName}-templates`
      : depName
    depInfo.chunks.forEach(chunk => {
      const set = subCommonChunks.get(chunk) || new Set<string>()
      set.add(resolvedDepName)
      subCommonChunks.set(chunk, set)
    })
  })
  return subCommonChunks
}

export function collectExistingSubCommonDeps<TChunk extends { name?: string | null } = any> (
  chunks: Iterable<TChunk>,
  subRoots: string[],
  subCommonDeps: Map<string, ISubCommonDepInfo>
): {
    subPackagesVendors: Map<string, TChunk>
    existSubCommonDeps: Map<string, ISubCommonDepInfo>
    subCommonChunks: Map<string, Set<string>>
  } {
  const subPackagesVendors = new Map<string, TChunk>()
  const existSubCommonDeps = new Map<string, ISubCommonDepInfo>()
  const subVendorsNames = new Set(subRoots.map(sr => normalizePath(path.join(sr, SUB_VENDORS_NAME))))
  const subCommonReg = new RegExp(`^${SUB_COMMON_DIR}\\/`)
  const subCommonPrefixReg = new RegExp(`^${SUB_COMMON_DIR}\\/(.*)`)

  for (const chunk of chunks) {
    const chunkName = chunk.name || ''
    if (!chunkName) {
      continue
    }

    if (subVendorsNames.has(chunkName)) {
      const subRoot = subRoots.find(sr => new RegExp(`^${sr}\\/`).test(chunkName))
      if (subRoot) {
        subPackagesVendors.set(subRoot, chunk)
      }
    }

    if (subCommonReg.test(chunkName)) {
      const depName = chunkName.replace(subCommonPrefixReg, '$1')
      const dep = subCommonDeps.get(depName)
      if (dep) {
        existSubCommonDeps.set(depName, dep)
      }
    }
  }

  const subCommonChunks = buildSubCommonChunksMap(existSubCommonDeps)
  return { subPackagesVendors, existSubCommonDeps, subCommonChunks }
}

export function isExcludeSplitModule (
  module: any,
  exclude: Array<string | ((module: any) => boolean)>
): boolean {
  if (!isArray(exclude) || exclude.length === 0) {
    return false
  }
  const moduleResource = module.resource
  for (let i = 0; i < exclude.length; i++) {
    const excludeItem = exclude[i]
    if (isString(excludeItem) && excludeItem === moduleResource) {
      return true
    }
    if (isFunction(excludeItem) && excludeItem(module)) {
      return true
    }
  }
  return false
}

export function hasMainPackageChunk (chunkNames: string[], subRootRegExps: RegExp[]): boolean {
  return Boolean(chunkNames.find(cn => !subRootRegExps.some(r => r.test(cn))))
}

export function isMultiSubPackageDep (chunkNames: string[], subRoots: string[]): boolean {
  const roots = new Set<string>()
  chunkNames.forEach(cn => {
    subRoots.forEach(sr => {
      if (new RegExp(`^${sr}\\/`).test(cn)) {
        roots.add(sr)
      }
    })
  })
  return roots.size > 1
}

export function processSubPackageSplitAssets ({
  assets,
  entryNames,
  distPath,
  subRoots,
  subRootRegExps,
  subCommonChunks,
  styleExt,
  sources,
  extraExts = [],
  copyAsset
}: {
  assets: Record<string, any>
  entryNames: Iterable<string>
  distPath: string
  subRoots: string[]
  subRootRegExps: RegExp[]
  subCommonChunks: Map<string, Set<string>>
  styleExt: string
  sources: IBundlerSources
  extraExts?: string[]
  copyAsset?: (assetSource: any) => any
}) {
  const { ConcatSource, RawSource } = sources
  const jsExt = '.js'
  const jsMapExt = '.js.map'
  const exts = [jsExt, styleExt, ...extraExts]
  const cloneAsset = copyAsset || ((assetSource: any) => new RawSource(assetSource.source()))

  for (const entryName of entryNames) {
    const isSubEntry = Boolean(subRootRegExps.find(r => r.test(entryName))) && !entryName.includes('.config')
    if (!isSubEntry || path.extname(entryName)) {
      continue
    }

    const subRoot = subRoots.find(sr => new RegExp(`^${sr}\\/`).test(entryName))
    if (!subRoot) {
      continue
    }

    const subCommon = [...(subCommonChunks.get(entryName) || [])]
    for (const ext of exts) {
      const source = new ConcatSource()
      const chunkName = `${entryName}${ext}`
      const chunkAbsolutePath = path.resolve(distPath, chunkName)
      const subVendorsPath = path.join(subRoot, `${SUB_VENDORS_NAME}${ext}`)

      subCommon.forEach(moduleName => {
        const moduleFileName = `${moduleName}${ext}`
        const moduleFilePath = path.join(SUB_COMMON_DIR, moduleFileName)
        const subRootModuleFilePath = path.join(subRoot, moduleFilePath)
        const assetSource = assets[normalizePath(moduleFilePath)]
        if (assetSource) {
          const moduleAbsolutePath = path.resolve(distPath, subRootModuleFilePath)
          const chunkRelativePath = promoteRelativePath(path.relative(chunkAbsolutePath, moduleAbsolutePath))
          assets[normalizePath(subRootModuleFilePath)] = cloneAsset(assetSource)

          const originSourceMapPath = normalizePath(path.join(SUB_COMMON_DIR, `${moduleName}${jsMapExt}`))
          const originSourceMap = assets[originSourceMapPath]
          if (ext === jsExt && originSourceMap) {
            const subRootSourceMapFilePath = normalizePath(path.join(subRoot, originSourceMapPath))
            assets[subRootSourceMapFilePath] = cloneAsset(originSourceMap)
          }
          if (ext === styleExt) {
            source.add(`@import ${JSON.stringify(chunkRelativePath)};`)
          } else if (ext === jsExt) {
            source.add(`require(${JSON.stringify(chunkRelativePath)});`)
          }
        }
      })

      if (assets[normalizePath(subVendorsPath)]) {
        const subVendorsAbsolutePath = path.resolve(distPath, subVendorsPath)
        const vendorsRelativePath = promoteRelativePath(path.relative(chunkAbsolutePath, subVendorsAbsolutePath))
        if (ext === styleExt) {
          source.add(`@import ${JSON.stringify(vendorsRelativePath)};`)
        } else if (ext === jsExt) {
          source.add(`require(${JSON.stringify(vendorsRelativePath)});`)
        }
      }

      if (assets[chunkName]) {
        const originSource = assets[chunkName].source()
        if (ext === styleExt && typeof originSource === 'string') {
          if (originSource.indexOf('@charset') > -1) {
            assets[chunkName] = new RawSource(`@charset "UTF-8";${source.source()}${originSource.replace('@charset "UTF-8";', '')}`)
          } else {
            assets[chunkName] = new RawSource(`${source.source()}${originSource}`)
          }
        }
        if (ext === jsExt && typeof originSource === 'string') {
          if (originSource.indexOf('use strict') > -1) {
            assets[chunkName] = new RawSource(`"use strict";${source.source()}${originSource.replace('"use strict";', '')}`)
          } else {
            assets[chunkName] = new RawSource(`${source.source()}${originSource}`)
          }
        }
      } else {
        assets[chunkName] = new RawSource(`${source.source()}`)
      }
    }
  }

  for (const assetPath of Object.keys(assets)) {
    if (new RegExp(`^${SUB_COMMON_DIR}\\/.*`).test(assetPath)) {
      delete assets[assetPath]
    }
  }
}
