const { CurrentReconciler } = require('@tarojs/runtime')
const taro = require('@tarojs/api').default

if (typeof CurrentReconciler.initNativeApi === 'function') {
  CurrentReconciler.initNativeApi(taro)
}

module.exports = taro
module.exports.default = module.exports
