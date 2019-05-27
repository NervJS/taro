/* eslint-disable camelcase */
import {
  getEnv,
  ENV_TYPE,
  Events,
  eventCenter,
  render,
  internal_safe_get,
  internal_safe_set,
  internal_dynamic_recursive
} from '@tarojs/taro'

import initNativeApi from './native-api'
import { Component, PureComponent } from './component'

const Taro = {
  getEnv,
  ENV_TYPE,
  Events,
  eventCenter,
  render,
  initNativeApi,
  internal_safe_get,
  internal_safe_set,
  internal_dynamic_recursive,
  Component,
  PureComponent
}



export {
  getEnv,
  ENV_TYPE,
  Events,
  eventCenter,
  render,
  initNativeApi,
  internal_safe_get,
  internal_safe_set,
  internal_dynamic_recursive,
  Component,
  PureComponent
}

initNativeApi(Taro)

export default Taro
