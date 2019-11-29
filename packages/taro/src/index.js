/* eslint-disable camelcase */
import './polyfill'
import { getEnv, ENV_TYPE } from './env'
import Events from './events'
import render from './render'
import Link from './interceptor'
import * as interceptors from './interceptor/interceptors'
import {
  noPromiseApis,
  onAndSyncApis,
  otherApis,
  initPxTransform
} from './native-apis'
import {
  Current,
  useDidShow,
  useDidHide,
  usePullDownRefresh,
  useReachBottom,
  usePageScroll,
  useResize,
  useShareAppMessage,
  useTabItemTap,
  useTitleClick,
  useOptionMenuClick,
  usePullIntercept,
  useRouter
} from '@tarojs/runtime'

let eventCenter
if (process.env.TARO_ENV === 'alipay') {
  if (!my.taroEventCenter) {
    my.taroEventCenter = new Events()
  }
  eventCenter = my.taroEventCenter
} else {
  eventCenter = new Events()
}

export const Taro = {
  Events,
  eventCenter,
  getEnv,
  ENV_TYPE,
  render,
  noPromiseApis,
  onAndSyncApis,
  otherApis,
  initPxTransform,
  Link,
  interceptors,
  Current,
  useDidShow,
  useDidHide,
  usePullDownRefresh,
  useReachBottom,
  usePageScroll,
  useResize,
  useShareAppMessage,
  useTabItemTap,
  useTitleClick,
  useOptionMenuClick,
  usePullIntercept,
  useRouter
}

export default Taro
