/* eslint-disable camelcase */
import './polyfill'

import {
  Current,
  eventCenter,
  Events,
  getCurrentInstance,
  nextTick,
  options
} from '@tarojs/runtime'

import { ENV_TYPE, getEnv } from './env'
import Link, { interceptorify } from './interceptor'
import * as interceptors from './interceptor/interceptors'
import {
  Behavior,
  getInitPxTransform,
  getPreload,
  getPxTransform,
} from './tools'

const Taro = {
  Behavior,
  getEnv,
  ENV_TYPE,
  Link,
  interceptors,
  Current,
  getCurrentInstance,
  options,
  nextTick,
  eventCenter,
  Events,
  getInitPxTransform,
  interceptorify
}

Taro.initPxTransform = getInitPxTransform(Taro)
Taro.preload = getPreload(Current)
Taro.pxTransform = getPxTransform(Taro)

export default Taro
