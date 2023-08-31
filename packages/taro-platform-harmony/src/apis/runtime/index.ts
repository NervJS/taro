// eslint-disable-next-line import/no-duplicates
import { Current } from '@tarojs/runtime'
// eslint-disable-next-line import/no-duplicates
import { eventCenter } from '@tarojs/runtime/dist/runtime.esm'

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

const getCurrentInstance = () => Current

export {
  ENV_TYPE,
  eventCenter,
  getCurrentInstance,
  getEnv,
}
