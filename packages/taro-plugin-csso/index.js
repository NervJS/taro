const csso = require('csso')

module.exports = function minifyCSS (content, file, config) {
  return csso.minify(content, config)
}
