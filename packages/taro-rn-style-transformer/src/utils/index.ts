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

export default {}
