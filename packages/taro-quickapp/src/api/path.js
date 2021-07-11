// copy from https://github.com/jinder/path/blob/master/path.js
export function resolve () {
  var resolvedPath = ''
  var resolvedAbsolute = false

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : '/'

    if (!path) {
      continue
    }

    resolvedPath = path + '/' + resolvedPath
    resolvedAbsolute = path[0] === '/'
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(resolvedPath.split('/'),
    !resolvedAbsolute).join('/')

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.'
}

function normalizeArray (parts, allowAboveRoot) {
  var res = []
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i]

    // ignore empty parts
    if (!p || p === '.') { continue }

    if (p === '..') {
      if (res.length && res[res.length - 1] !== '..') {
        res.pop()
      } else if (allowAboveRoot) {
        res.push('..')
      }
    } else {
      res.push(p)
    }
  }

  return res
}
