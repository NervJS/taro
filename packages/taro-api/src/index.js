/* eslint-disable camelcase */
import './polyfill'
import { getEnv, ENV_TYPE } from './env'
import Link from './interceptor'
import * as interceptors from './interceptor/interceptors'
import {
  Behavior,
  getPreload,
  getPxTransform,
  getInitPxTransform
} from './tools'
import {
  Current,
  getCurrentInstance,
  options,
  nextTick,
  eventCenter,
  Events,
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
  useShareTimeline,
  useAddToFavorites,
  useReady,
  useRouter
} from '@tarojs/runtime'

const Taro = {
  Behavior,
  getEnv,
  ENV_TYPE,
  Link,
  interceptors,
  initPxTransform: getInitPxTransform(Taro),
  Current,
  getCurrentInstance,
  options,
  nextTick,
  eventCenter,
  Events,
  getPreload: getPreload(Taro),
  pxTransform: getPxTransform(Taro),
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
  useShareTimeline,
  useAddToFavorites,
  useReady,
  useRouter
}

export default Taro
