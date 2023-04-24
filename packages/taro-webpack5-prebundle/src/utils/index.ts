import { chalk, fs } from '@tarojs/helper'
import { createHash } from 'crypto'
import enhancedResolve from 'enhanced-resolve'
import path from 'path'
import { performance } from 'perf_hooks'

import type Chain from 'webpack-chain'
import type { CollectedDeps } from './constant'

export interface Metadata {
  bundleHash?: string
  mfHash?: string
  taroRuntimeBundlePath?: string
  runtimeRequirements?: Set<string>
  remoteAssets?: { name: string }[]
}

let resolve: (importer: string, request: string) => Promise<string>
export function createResolve (appPath: string, resolveOptions) {
  const defaultResolveOptions = {
    conditionNames: ['require', 'import', 'module', 'webpack', 'development', 'browser'],
    aliasFields: ['browser'],
    cache: true,
    mainFiles: ['index'],
    exportsFields: ['exports'],
    roots: appPath
  }
  const resolver = enhancedResolve.create({
    ...defaultResolveOptions,
    ...resolveOptions
  })
  resolve = function (importer: string, request: string): Promise<string> {
    return new Promise((resolve, reject) => {
      resolver({}, importer, request, {}, (err, resolvedPath) => {
        if (err) return reject(err)
        resolve(resolvedPath)
      })
    })
  }
}
export function getResolve () {
  return resolve
}

export function flattenId (id: string) {
  return id.replace(/(\s*>\s*)/g, '__').replace(/[/.:]/g, '_')
}

export function getCacheDir (appPath: string, env = '') {
  return path.resolve(appPath, './node_modules/.taro', env)
}

export function getDefines (chain: Chain) {
  let defines
  if (chain.plugins.has('definePlugin')) {
    chain.plugin('definePlugin').tap(args => {
      defines = { ...args[0] }
      Object.keys(defines).forEach(name => {
        if (typeof defines[name] !== 'string') {
          delete defines[name]
        }
      })
      return args
    })
  }
  return defines
}

export function isExclude (id: string, excludes: (string | RegExp)[]) {
  return Boolean(excludes.find(item => {
    const dollarTailRE = /\$$/

    if (item instanceof RegExp) {
      return item.test(id)
    } else if (dollarTailRE.test(item)) {
      // 全路径匹配
      item = item.replace(dollarTailRE, '')
      if (item === id) return true
    } else {
      if (item === id || id.startsWith(item + '/')) return true
    }
  }))
}

export function isOptimizeIncluded (path: string) {
  return /\.m?[jt]sx?$/.test(path)
}

export function isScanIncluded (path: string) {
  return /\.vue/.test(path)
}

export function getHash (content: string) {
  return createHash('sha256').update(content).digest('hex').substring(0, 8)
}

export async function getBundleHash (appPath: string, deps: CollectedDeps, chain: Chain, cacheDir: string): Promise<string> {
  const defines = getDefines(chain)
  const lockfiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']
  const lockfilesContents = await Promise.all(lockfiles.map(item => {
    return new Promise<string>(resolve => {
      fs.readFile(path.join(appPath, item))
        .then(content => resolve(content.toString()))
        .catch(() => resolve(''))
    })
  }))
  return getHash(
    formatDepsString(deps) +
    lockfilesContents.join('\n') +
    JSON.stringify(defines) +
    cacheDir
  )
}

export const sortDeps = (a: string | string[], b: string | string[]) => {
  const x = typeof a === 'string' ? a : a[0]
  const y = typeof b === 'string' ? b : b[0]
  return x.localeCompare(y)
}

export function formatDepsString (deps: CollectedDeps) {
  const list = Array.from(deps.entries()).sort(sortDeps)
  return JSON.stringify(list)
}

export function getMfHash (obj: Record<string, any>) {
  return getHash(JSON.stringify(obj))
}

export async function commitMeta (appPath: string, metadataPath: string, metadata: Metadata) {
  // Todo: 改为相对路径
  await fs.writeJSON(metadataPath, metadata, {
    spaces: 2,
    replacer (key, value) {
      if (value instanceof Set) {
        return Array.from(value)
      }
      if (key === 'taroRuntimeBundlePath') {
        return path.relative(appPath, value)
      }
      return value
    }
  })
}

export function getMeasure (isLogTiming?: boolean) {
  return function (name: string, start: number) {
    if (isLogTiming) {
      const now = performance.now()
      const duration = now - start
      console.log(chalk.cyan(`${name}: ${Math.round(duration)}ms\n`))
    }
  }
}

export * from './path'
export * from './webpack'
