const fs = require('fs')
const path = require('path')
const stylus = require('stylus')

module.exports = function compileStylus (content, file, config) {
  return new Promise((resolve, reject) => {
    if (!content && !fs.existsSync(file)) {
      return resolve({
        css: ''
      })
    }
    if (!content) {
      content = fs.readFileSync(file).toString()
    }
    const opath = path.parse(file)
    config.paths = [opath.dir].concat(config.paths || [])
    config.filename = opath.base
    const instance = stylus(content, { filename: file })
    for (const k in config) {
      instance.set(k, config[k])
    }
    let imports = instance.deps()
    instance.render((err, css) => {
      if (err) {
        return reject(err)
      }
      resolve({
        css,
        imports
      })
    })
  })
}
