const path = require('path')

exports.isEmptyObject = function (obj) {
  if (obj == null) {
    return true
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false
    }
  }
  return true
}

exports.getRootPath = function () {
  return path.resolve(__dirname, '../../')
}
