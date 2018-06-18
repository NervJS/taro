const fs = require('fs')
const less = require('less')

module.exports = function compileLess (content, file, config) {
  return new Promise((resolve, reject) => {
    if (!content && !fs.existsSync(file)) {
      return resolve({
        css: ''
      })
    }
    if (!content) {
      content = fs.readFileSync(file).toString()
    }
    less.render(content, config).then((res, imports) => {
      resolve({ css: res.css, imports: res.imports })
    }).catch(reject)
  })
}
