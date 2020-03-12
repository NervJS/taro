const Taro = require('@tarojs/api').default

let api

// bundler 可以自动移除不需要的 require
if (process.env.TARO_ENV === 'alipay') {
  api = require('./lib/alipay')
} else if (process.env.TARO_ENV === 'jd') {
  api = require('./lib/jd')
} else if (process.env.TARO_ENV === 'qq') {
  api = require('./lib/qq')
} else if (process.env.TARO_ENV === 'swan') {
  api = require('./lib/swan')
} else if (process.env.TARO_ENV === 'tt') {
  api = require('./lib/tt')
} else if (process.env.TARO_ENV === 'weapp') {
  api = require('./lib/wx')
}

// 兼容不同工具的 import 机制，如 Jest, rollup
const initNativeAPI = api && api.default ? api.default : api
// 如果没有对应的 env type，那就啥也不干，例如 h5
if (typeof initNativeAPI === 'function') {
  initNativeAPI(Taro)
}

module.exports = Taro
module.exports.default = module.exports
