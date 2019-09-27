export const ENV_TYPE = {
  WEAPP: 'WEAPP',
  WEB: 'WEB',
  RN: 'RN',
  SWAN: 'SWAN',
  ALIPAY: 'ALIPAY',
  TT: 'TT',
  QQ: 'QQ',
  JD: 'JD'
}

export function getEnv () {
  if (typeof jd !== 'undefined' && jd.getSystemInfo) {
    return ENV_TYPE.JD
  }
  if (typeof qq !== 'undefined' && qq.getSystemInfo) {
    return ENV_TYPE.QQ
  }
  if (typeof tt !== 'undefined' && tt.getSystemInfo) {
    return ENV_TYPE.TT
  }
  if (typeof wx !== 'undefined' && wx.getSystemInfo) {
    return ENV_TYPE.WEAPP
  }
  if (typeof swan !== 'undefined' && swan.getSystemInfo) {
    return ENV_TYPE.SWAN
  }
  if (typeof my !== 'undefined' && my.getSystemInfo) {
    return ENV_TYPE.ALIPAY
  }
  if (typeof global !== 'undefined' && global.__fbGenNativeModule) {
    return ENV_TYPE.RN
  }
  if (typeof window !== 'undefined') {
    return ENV_TYPE.WEB
  }
  return 'Unknown environment'
}
