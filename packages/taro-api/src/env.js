export const ENV_TYPE = {
  WEAPP: 'WEAPP',
  WEB: 'WEB',
  RN: 'RN',
  SWAN: 'SWAN',
  ALIPAY: 'ALIPAY',
  TT: 'TT',
  QQ: 'QQ',
  JD: 'JD',
  QUICKAPP: 'QUICKAPP'
}

/** @type {keyof ENV_TYPE} */
let _env

export function getEnv () {
  if (_env) return _env
  if (process.env.TARO_ENV === 'weapp') {
    _env = ENV_TYPE.WEAPP
  } else if (process.env.TARO_ENV === 'alipay') {
    _env = ENV_TYPE.ALIPAY
  } else if (process.env.TARO_ENV === 'swan') {
    _env = ENV_TYPE.SWAN
  } else if (process.env.TARO_ENV === 'tt') {
    _env = ENV_TYPE.TT
  } else if (process.env.TARO_ENV === 'jd') {
    _env = ENV_TYPE.JD
  } else if (process.env.TARO_ENV === 'qq') {
    _env = ENV_TYPE.QQ
  } else if (process.env.TARO_ENV === 'h5') {
    _env = ENV_TYPE.WEB
  } else if (process.env.TARO_ENV === 'rn') {
    _env = ENV_TYPE.RN
  } else if (process.env.TARO_ENV === 'quickapp') {
    _env = ENV_TYPE.QUICKAPP
  } else {
    _env = process.env.TARO_ENV || 'Unknown'
  }
  return _env
}
