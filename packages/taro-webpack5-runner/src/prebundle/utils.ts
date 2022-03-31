import * as enhancedResolve from 'enhanced-resolve'
import * as path from 'path'

import type { MiniCombination } from '../webpack/MiniCombination'

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

export function externalModule ({ path }: { path: string }) {
  return {
    path,
    external: true
  }
}

export function canBeOptimized (path: string) {
  return /\.[jt]sx?$/.test(path)
}

export function canBeScaned (path: string) {
  return /\.vue/.test(path)
}

export function flattenId (id: string) {
  return id.replace(/(\s*>\s*)/g, '__').replace(/[/.:]/g, '_')
}

export function getDepsCacheDir (appPath: string) {
  return path.resolve(appPath, './node_modules/.taro', './prebundle')
}

export function getDefines (combination: MiniCombination) {
  let defines
  combination.chain.plugin('definePlugin').tap(args => {
    defines = args[0]
    return args
  })
  return defines
}

export function isExclude (id: string, excludes: string[]) {
  return Boolean(excludes.find(item => {
    const dollarTailRE = /\$$/

    if (dollarTailRE.test(item)) {
      // 全路径匹配
      item = item.replace(dollarTailRE, '')
      if (item === id) return true
    } else {
      if (item === id || id.startsWith(item + '/')) return true
    }
  }))
}
