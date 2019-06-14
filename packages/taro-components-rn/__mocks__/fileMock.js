const path = require('path')

/**
 * REF: https://jestjs.io/docs/en/webpack
 */
module.exports = (src, filename, config, options) => {
  return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';'
}
