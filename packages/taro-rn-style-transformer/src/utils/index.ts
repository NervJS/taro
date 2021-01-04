import fs from 'fs'
import path from 'path'

export function insertBefore (source: string, target: string) {
  if (!source && !target) {
    return ''
  }
  if (!source) {
    return target
  }
  if (!target) {
    return source
  }
  return target + ';\n' + source
}

export function insertAfter (source: string, target: string) {
  if (!source && !target) {
    return ''
  }
  if (!source) {
    return target
  }
  if (!target) {
    return source
  }
  return source + ';\n' + target
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

  return false
}

export const getCSSExts = platform => [
  platform === 'android' ? '.android.css' : '.ios.css',
  '.rn.css',
  '.css'
]

/**
 * 返回存在的文件path
 * @param id import id
 * @param opts { basedir, platform, paths }
 */
export function resolveStyle (id, opts) {
  const { basedir, platform, paths = [] } = opts
  const { dir, name, ext } = path.parse(id)
  const incPaths = [path.resolve(basedir, dir)].concat(paths)

  const exts = [
    // add the platform specific extension, first in the array to take precedence
    platform === 'android' ? '.android' + ext : '.ios' + ext,
    '.rn' + ext,
    ext
  ]
  const file = findVariant(name, exts, incPaths)
  if (!file) {
    throw new Error(`
    样式文件没有找到，请检查文件路径: ${id}
      在 [
        ${incPaths.join(',\n       ')}
      ]
    `)
  }

  return file
}

export default {}
