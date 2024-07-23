/**
 * Check whether a string has postcss-simple-vars interpolation
 */
export function hasPsvInterpolation (string /*: string */) /*: boolean */ {
  if (/\$\(.+?\)/.test(string)) {
    return true
  }

  return false
}
