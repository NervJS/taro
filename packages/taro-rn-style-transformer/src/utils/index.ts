import { printLog, processTypeEnum } from '@tarojs/helper'
import * as fs from 'fs'
import * as path from 'path'
import * as resolve from 'resolve'
import nodeModulesPaths from 'resolve/lib/node-modules-paths'

import { LogLevelEnum, ResolveStyleOptions } from '../types'

export function insertBefore (source?: string, additional?: string) {
  if (!source && !additional) {
    return ''
  }
  if (!source) {
    return additional
  }
  if (!additional) {
    return source
  }
  return additional + ';\n' + source
}

export function insertAfter (source?: string, additional?: string) {
  if (!source && !additional) {
    return ''
  }
  if (!source) {
    return additional
  }
  if (!additional) {
    return source
  }
  return source + ';\n' + additional
}

// Iterate through the include paths and extensions to find the file variant
export function findVariant (name, extensions, includePaths) {
  for (let i = 0; i < includePaths.length; i++) {
    const includePath = includePaths[i]

    // try to find the file iterating through the extensions, in order.
    const foundExtention = extensions.find(extension => {
      const fname = path.join(includePath, name + extension)
      return fs.existsSync(fname)
    })

    if (foundExtention) {
      return path.join(includePath, name + foundExtention)
    }
  }

  return ''
}

/**
 * 返回存在的文件path
 * @param id import id
 * @param opts { basedir, platform, paths }
 */
export function resolveStyle (id: string, opts: ResolveStyleOptions) {
  const {
    basedir,
    platform,
    paths = [],
    alias = {},
    defaultExt = '',
    logLevel = LogLevelEnum.ERROR
  } = opts
  id = id.trim()
  Object.keys(alias).forEach(key => {
    if (id.startsWith(key)) {
      id = id.replace(key, alias[key])
    }
  })

  const { dir, name, ext: idExt } = path.parse(id)
  const incPaths = [path.resolve(basedir, dir)].concat(paths)
  const ext = idExt || defaultExt

  const extensions = [
    // add the platform specific extension, first in the array to take precedence
    platform === 'android' ? '.android' + ext : '.ios' + ext,
    '.rn' + ext,
    ext
  ]

  let file = ''
  let isNodeModulesPath = false
  try {
    if ((/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/).test(id)) {
      file = findVariant(name, extensions, incPaths)
    } else {
      // lookup node_modules file
      isNodeModulesPath = true
      // like `@import 'taro-ui/dist/base.css';` or `@import '~taro-ui/dist/base.css';`
      file = resolve.sync(path.join(dir, name).replace(/^~/, ''), { basedir, extensions })
    }
  } catch (error) {
  }

  if (!file) {
    let includePaths = incPaths
    if (isNodeModulesPath) {
      includePaths = nodeModulesPaths(basedir, { extensions }, id)
    }
    const levelMessage = `
    样式文件没有找到，请检查文件路径: ${id}
      在 [
        ${includePaths.join(',\n       ')}
      ]
    `
    if (logLevel === LogLevelEnum.ERROR) {
      throw new Error(levelMessage)
    }
    if (logLevel === LogLevelEnum.WARNING) {
      printLog(processTypeEnum.WARNING, levelMessage)
      return id
    }
  }

  return file
}

// copy from https://github.com/webpack-contrib/css-loader/blob/master/src/utils.js
const IS_NATIVE_WIN32_PATH = /^[a-z]:[/\\]|^\\\\/i
const ABSOLUTE_SCHEME = /^[a-z0-9+\-.]+:/i

export function normalizePath (file) {
  return path.sep === '\\' ? file.replace(/\\/g, '/') : file
}

function getURLType (source) {
  if (source[0] === '/') {
    if (source[1] === '/') {
      return 'scheme-relative'
    }

    return 'path-absolute'
  }

  if (IS_NATIVE_WIN32_PATH.test(source)) {
    return 'path-absolute'
  }

  return ABSOLUTE_SCHEME.test(source) ? 'absolute' : 'path-relative'
}

export function normalizeSourceMap (map, resourcePath) {
  let newMap = map

  // Some loader emit source map as string
  // Strip any JSON XSSI avoidance prefix from the string (as documented in the source maps specification), and then parse the string as JSON.
  if (typeof newMap === 'string') {
    newMap = JSON.parse(newMap)
  }

  delete newMap.file

  const { sourceRoot } = newMap

  delete newMap.sourceRoot

  if (newMap.sources) {
    // Source maps should use forward slash because it is URLs (https://github.com/mozilla/source-map/issues/91)
    // We should normalize path because previous loaders like `sass-loader` using backslash when generate source map
    newMap.sources = newMap.sources.map((source) => {
      // Non-standard syntax from `postcss`
      if (source.indexOf('<') === 0) {
        return source
      }

      const sourceType = getURLType(source)

      // Do no touch `scheme-relative` and `absolute` URLs
      if (sourceType === 'path-relative' || sourceType === 'path-absolute') {
        const absoluteSource =
          sourceType === 'path-relative' && sourceRoot
            ? path.resolve(sourceRoot, normalizePath(source))
            : normalizePath(source)

        return path.relative(path.dirname(resourcePath), absoluteSource)
      }

      return source
    })
  }

  return newMap
}
// copy end

export function getAdditionalData (data: string, config?: string | ((key: string) => string)) {
  let additionalData = ''
  if (typeof config !== 'undefined') {
    additionalData =
      typeof config === 'function'
        ? `${config(data)}`
        : config
  }
  return additionalData
}

export default {}
