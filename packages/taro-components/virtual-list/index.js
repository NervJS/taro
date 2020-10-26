if (process.env.FRAMEWORK === 'vue') {
  module.exports = require('./vue').default
  module.exports.default = module.exports
} else {
  module.exports = require('./react').default
  module.exports.default = module.exports
}
