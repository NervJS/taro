import path from 'path'

/**
 * REF: https://jestjs.io/docs/en/webpack
 */
module.exports = (src, filename) => {
  return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';'
}
