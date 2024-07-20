/**
 * Modify from https://github.com/rollup/plugins/blob/master/packages/pluginutils/src/createFilter.ts
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Rich Harris @richard.a.harris@gmail.com
 */
import path from 'node:path'

import { isArray } from '@tarojs/shared'
import pm from 'picomatch'

function ensureArray(thing) {
  if (isArray(thing)) {
    return thing
  }
  if (thing == null) {
    return []
  }
  return [thing]
}

const normalizePath = function normalizePath(filename) {
  return filename.split(path.win32.sep).join(path.posix.sep)
}

function getMatcherString(id, resolutionBase) {
  if (resolutionBase === false || path.isAbsolute(id) || id.startsWith('*')) {
    return normalizePath(id)
  }
  // resolve('') is valid and will default to process.cwd()
  const basePath = normalizePath(path.resolve(resolutionBase || ''))
    // escape all possible (posix + win) path characters that might interfere with regex
    .replace(/[-^$*+?.()|[\]{}]/g, '\\$&')
  // Note that we use posix.join because:
  // 1. the basePath has been normalized to use /
  // 2. the incoming glob (id) matcher, also uses /
  // otherwise Node will force backslash (\) on windows
  return path.posix.join(basePath, normalizePath(id))
}

export default function createFilter(include, exclude, options?) {
  const resolutionBase = options && options.resolve
  const getMatcher = (id) => id instanceof RegExp
    ? id
    : {
      test: (what) => {
        // this refactor is a tad overly verbose but makes for easy debugging
        const pattern = getMatcherString(id, resolutionBase)
        const fn = pm(pattern, { dot: true })
        const result = fn(what)
        return result
      }
    }
  const includeMatchers = ensureArray(include).map(getMatcher)
  const excludeMatchers = ensureArray(exclude).map(getMatcher)
  return function result(id) {
    if (typeof id !== 'string') {
      return false
    }
    // 因为 vite 的虚拟模块也是 \0 开头的，会导致虚拟模块一直走不到 babel 的逻辑被过滤掉
    // if (virtualModulePrefixREG.test(id))
    //   return false
    const pathId = normalizePath(id)
    for (let i = 0; i < excludeMatchers.length; ++i) {
      const matcher = excludeMatchers[i]
      if (matcher.test(pathId)) {
        return false
      }
    }
    for (let i = 0; i < includeMatchers.length; ++i) {
      const matcher = includeMatchers[i]
      if (matcher.test(pathId)) {
        return true
      }
    }
    return !includeMatchers.length
  }
}
