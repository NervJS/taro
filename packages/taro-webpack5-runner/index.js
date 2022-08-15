if (process.env.TARO_ENV === 'h5') {
  module.exports = require('./dist/index.h5.js').default
} else {
  module.exports = require('./dist/index.mini.js').default
}

module.exports.default = module.exports
