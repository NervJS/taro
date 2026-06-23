/**
 * Check whether a string has scss interpolation
 */
export function hasScssInterpolation (string /*: string */) /*: boolean */ {
  if (/#{.+?}/.test(string)) {
    return true
  }

  return false
}
