const upperCasePattern = /([A-Z])/g

function dashify (str) {
  return str.replace(upperCasePattern, dashLower)
}

function dashLower (c) {
  return '-' + c.toLowerCase()
}

function isObject (val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false
}

export function inlineStyle (obj) {
  if (obj == null) {
    return ''
  }
  if (typeof obj === 'string') {
    return obj
  }

  if (obj === null || obj === undefined) {
    return ''
  }

  if (!isObject(obj)) {
    throw new TypeError('style 只能是一个对象或字符串。')
  }

  return Object.keys(obj).map((key) => dashify(key).concat(':').concat(obj[key])).join(';')
}
