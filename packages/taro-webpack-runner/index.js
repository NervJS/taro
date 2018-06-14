const { buildProd, buildDev } = require('./src')

module.exports = function (config, customWebpackConfig = {}) {
  if (config.isWatch) {
    return buildDev(config, customWebpackConfig)
  }
  buildProd(config, customWebpackConfig)
}
