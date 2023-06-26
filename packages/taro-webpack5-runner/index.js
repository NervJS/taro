if (require('@tarojs/shared').isWebPlatform()) {
  module.exports = require('./dist/index.h5.js').default
} else {
  module.exports = require('./dist/index.mini.js').default
}

module.exports.default = module.exports
