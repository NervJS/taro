const { transform } = require('babel-core')

module.exports = function babel (content, file, config) {
  let p
  try {
    const res = transform(content, config)
    p = Promise.resolve(res)
  } catch (e) {
    p = Promise.reject(e)
  }
  return p
}
