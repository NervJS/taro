const reconciler = require('@tarojs/runtime').CurrentReconciler
const taro = require('./dist/index.esm').default

if (typeof reconciler.initNativeApi === 'function') {
  reconciler.initNativeApi(taro)
}

module.exports = taro
module.exports.default = module.exports
