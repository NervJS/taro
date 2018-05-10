const uglifyJS = require('uglify-js')

module.exports = function uglify (content, file, config) {
  return uglifyJS.minify(content, config)
}
