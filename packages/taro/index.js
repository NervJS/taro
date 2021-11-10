const { container, SERVICE_IDENTIFIER } = require('@tarojs/runtime')
const taro = require('@tarojs/api').default

const hooks = container.get(SERVICE_IDENTIFIER.Hooks)
if (typeof hooks.initNativeApi === 'function') {
  hooks.initNativeApi(taro)
}

module.exports = taro
module.exports.default = module.exports
