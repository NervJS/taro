export const ENV_TYPE = {
  WEAPP: 'WEAPP',
  SWAN: 'SWAN',
  ALIPAY: 'ALIPAY',
  TT: 'TT',
  QQ: 'QQ',
  JD: 'JD',
  WEB: 'WEB',
  RN: 'RN',
  HARMONY: 'HARMONY',
  QUICKAPP: 'QUICKAPP',
  HARMONYHYBRID: 'HARMONYHYBRID',
}

export function getEnv () {
  if (process.env.TARO_ENV === 'weapp') {
    return ENV_TYPE.WEAPP
  } else if (process.env.TARO_ENV === 'alipay') {
    return ENV_TYPE.ALIPAY
  } else if (process.env.TARO_ENV === 'swan') {
    return ENV_TYPE.SWAN
  } else if (process.env.TARO_ENV === 'tt') {
    return ENV_TYPE.TT
  } else if (process.env.TARO_ENV === 'jd') {
    return ENV_TYPE.JD
  } else if (process.env.TARO_ENV === 'qq') {
    return ENV_TYPE.QQ
  } else if (process.env.TARO_ENV === 'harmony-hybrid') {
    return ENV_TYPE.HARMONYHYBRID
  } else if (process.env.TARO_ENV === 'h5' || process.env.TARO_PLATFORM === 'web') {
    return ENV_TYPE.WEB
  } else if (process.env.TARO_ENV === 'rn') {
    return ENV_TYPE.RN
  } else if (process.env.TARO_ENV === 'harmony' || process.env.TARO_PLATFORM === 'harmony') {
    return ENV_TYPE.HARMONY
  } else if (process.env.TARO_ENV === 'quickapp') {
    return ENV_TYPE.QUICKAPP
  } else {
    return process.env.TARO_ENV || 'Unknown'
  }
}
