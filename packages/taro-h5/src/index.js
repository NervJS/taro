/* eslint-disable camelcase */
import {
  getEnv,
  ENV_TYPE,
  Events,
  eventCenter,
  render,
  internal_safe_get,
  internal_safe_set
} from '@tarojs/taro'

import initNativeApi from './native-api'
import Component from './component'

export const Taro = {
  initNativeApi,
  Component,
  getEnv,
  ENV_TYPE,
  Events,
  eventCenter,
  render,
  internal_safe_get,
  internal_safe_set
}

initNativeApi(Taro)

export default Taro
