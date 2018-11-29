const uglifyJS = require('uglify-js')

module.exports = function uglify (content, file, config) {
  let keywords = ['module', 'exports', 'require', 'Object', 'Array', 'RegExp'].filter((key) => content.indexOf(key) > -1)
  return uglifyJS.minify('(function(' + keywords.join(',') + '){\n' + content + '\n})(' + keywords.join(',') + ')', config)
}
