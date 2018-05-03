export const ENV_TYPE = {
  WEAPP: 'WEAPP',
  WEB: 'WEB',
  RN: 'RN'
}

export function getEnv () {
  if (typeof wx !== 'undefined' && wx.getSystemInfo) {
    return ENV_TYPE.WEAPP
  }
  if (typeof window !== 'undefined') {
    return ENV_TYPE.WEB
  }
  if (typeof global !== 'undefined' && global.ErrorUtils) {
    return ENV_TYPE.RN
  }
  return 'Unknown environment'
}
