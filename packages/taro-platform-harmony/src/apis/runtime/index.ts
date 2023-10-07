// eslint-disable-next-line import/no-duplicates
import { Current } from '@tarojs/runtime'
// eslint-disable-next-line import/no-duplicates
import { eventCenter, Events, History } from '@tarojs/runtime/dist/runtime.esm'

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

const nextTick = (cb: (...args: any[]) => any, ctx?: Record<string, any>) => {
  setTimeout(function () {
    ctx ? cb.call(ctx) : cb()
  }, 1)
}


export {
  ENV_TYPE,
  eventCenter,
  Events,
  getCurrentInstance,
  getEnv,
  History,
  nextTick,
}
