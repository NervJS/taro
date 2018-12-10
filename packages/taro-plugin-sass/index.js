const sass = require('node-sass')

module.exports = function compileSass (content, file, config) {
  return new Promise((resolve, reject) => {
    const opts = Object.assign(config, {
      file,
      data: content
    })
    var result
    try {
      result = sass.renderSync(opts)
    } catch (e) {
      reject(e)
    }
    resolve(result)
  })
}
