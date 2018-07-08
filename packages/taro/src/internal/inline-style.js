/*!
 * dashify <https://github.com/jonschlinkert/dashify>
 *
 * Convert a camelcase or space-separated string to a dash-separated string. ~12 sloc, fast, supports diacritics.
 *
 * console.log(dashify('fooBar'));
 * => 'foo-bar'
 *
 * Copyright (c) 2015-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
function dashify (str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string')
  }

  return str.trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\W/g, m => /[À-ž]/.test(m) ? m : '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, m => options && options.condense ? '-' : m)
    .toLowerCase()
}

function isObject (val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false
}

export function inlineStyle (obj) {
  if (typeof obj === 'string') {
    return obj
  }

  if (!isObject(obj)) {
    throw new TypeError('style 必须传入一个对象或字符串')
  }

  const props = Object.keys(obj)

  const styles = props.map((key) => {
    var prop = dashify(key)
    var line = prop.concat(':').concat(obj[key])
    return line
  })

  return styles.join(';')
}
