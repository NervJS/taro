export const ENV_TYPE = {
  WEAPP: 'WEAPP',
  WEB: 'WEB',
  RN: 'RN',
  SWAN: 'SWAN',
  ALIPAY: 'ALIPAY',
  QUICKAPP: 'QUICKAPP',
  TT: 'TT',
  QQ: 'QQ',
  JD: 'JD'
}

let _env = null

// 一个taro项目肯定运行同样的环境
export function getEnv () {
  if (_env) return _env
  if (typeof jd !== 'undefined' && jd.getSystemInfo) {
    _env = ENV_TYPE.JD
    return ENV_TYPE.JD
  }
  if (typeof qq !== 'undefined' && qq.getSystemInfo) {
    _env = ENV_TYPE.QQ
    return ENV_TYPE.QQ
  }
  if (typeof tt !== 'undefined' && tt.getSystemInfo) {
    _env = ENV_TYPE.TT
    return ENV_TYPE.TT
  }
  if (typeof wx !== 'undefined' && wx.getSystemInfo) {
    _env = ENV_TYPE.WEAPP
    return ENV_TYPE.WEAPP
  }
  if (typeof qa !== 'undefined' && qa.getSystemInfo) {
    _env = ENV_TYPE.QUICKAPP
    return ENV_TYPE.QUICKAPP
  }
  if (typeof swan !== 'undefined' && swan.getSystemInfo) {
    _env = ENV_TYPE.SWAN
    return ENV_TYPE.SWAN
  }
  if (typeof my !== 'undefined' && my.getSystemInfo) {
    _env = ENV_TYPE.ALIPAY
    return ENV_TYPE.ALIPAY
  }
  if (typeof global !== 'undefined' && global.__fbGenNativeModule) {
    _env = ENV_TYPE.RN
    return ENV_TYPE.RN
  }
  if (typeof window !== 'undefined') {
    _env = ENV_TYPE.WEB
    return ENV_TYPE.WEB
  }
  return 'Unknown environment'
}
