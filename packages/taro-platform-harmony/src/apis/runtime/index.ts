import { eventCenter, getCurrentInstance } from '@tarojs/runtime/dist/runtime.esm'

const ENV_TYPE = {
  WEAPP: 'WEAPP',
  SWAN: 'SWAN',
  ALIPAY: 'ALIPAY',
  TT: 'TT',
  QQ: 'QQ',
  JD: 'JD',
  WEB: 'WEB',
  RN: 'RN',
  HARMONY: 'HARMONY',
  QUICKAPP: 'QUICKAPP'
}

function getEnv () {
  return ENV_TYPE.HARMONY
}

export {
  ENV_TYPE,
  eventCenter,
  getCurrentInstance,
  getEnv,
}
