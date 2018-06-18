const ts = require('typescript')

module.exports = function tsc (content, file, config) {
  let p
  try {
    const res = ts.transpileModule(content, config)
    p = Promise.resolve(res)
  } catch (e) {
    p = Promise.reject(e)
  }
  return p
}
