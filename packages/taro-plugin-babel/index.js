const { transform } = require('babel-core')

module.exports = function babel (content, file, config) {
  let p
  try {
    if (!config) config = {}
    config.filename = file
    const res = transform(content, config)
    p = Promise.resolve(res)
  } catch (e) {
    p = Promise.reject(e)
  }
  return p
}
