/* eslint-disable camelcase */
import './polyfill'
import Component from './component'
import { get as internal_safe_get } from './internal/safe-get'
import { set as internal_safe_set } from './internal/safe-set'
import { inlineStyle as internal_inline_style } from './internal/inline-style'
import { getOriginal as internal_get_original } from './internal/get-original'
import { getEnv, ENV_TYPE } from './env'
import Events from './events'
import render from './render'
import { createRef, commitAttachRef, detachAllRef, RefsArray, handleLoopRef } from './ref'
import Link from './interceptor'
import * as interceptors from './interceptor/interceptors'
import {
  noPromiseApis,
  onAndSyncApis,
  otherApis,
  initPxTransform
} from './native-apis'
import {
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
  useRef,
  useCallback,
  useMemo,
  useImperativeHandle,
  invokeEffects,
  useContext,
  useDidShow,
  useDidHide,
  usePullDownRefresh,
  useReachBottom,
  usePageScroll,
  useResize,
  useShareAppMessage,
  useTabItemTap,
  useRouter,
  useScope,
  forceUpdateCallback as internal_force_update
} from './hooks'
import { Current } from './current'
import { createContext } from './create-context'
import { memo } from './memo'
import { setIsUsingDiff, getIsUsingDiff } from './util'

let eventCenter
if (process.env.TARO_ENV === 'alipay') {
  if (!my.taroEventCenter) {
    my.taroEventCenter = new Events()
  }
  eventCenter = my.taroEventCenter
} else {
  eventCenter = new Events()
}

export {
  Component,
  Events,
  eventCenter,
  getEnv,
  ENV_TYPE,
  render,
  internal_safe_get,
  internal_safe_set,
  internal_inline_style,
  internal_get_original,
  internal_force_update,
  noPromiseApis,
  onAndSyncApis,
  otherApis,
  initPxTransform,
  createRef,
  commitAttachRef,
  detachAllRef,
  Link,
  interceptors,
  RefsArray,
  handleLoopRef,
  Current,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
  useDidShow,
  useDidHide,
  usePullDownRefresh,
  useReachBottom,
  usePageScroll,
  useResize,
  useShareAppMessage,
  useTabItemTap,
  useRouter,
  useScope,
  useRef,
  useCallback,
  useMemo,
  useImperativeHandle,
  invokeEffects,
  useContext,
  createContext,
  memo,
  getIsUsingDiff,
  setIsUsingDiff
}

export default {
  Component,
  Events,
  eventCenter,
  getEnv,
  ENV_TYPE,
  render,
  internal_safe_get,
  internal_safe_set,
  internal_inline_style,
  internal_get_original,
  internal_force_update,
  noPromiseApis,
  onAndSyncApis,
  otherApis,
  initPxTransform,
  createRef,
  commitAttachRef,
  detachAllRef,
  Link,
  interceptors,
  RefsArray,
  handleLoopRef,
  Current,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
  useDidShow,
  useDidHide,
  usePullDownRefresh,
  useReachBottom,
  usePageScroll,
  useResize,
  useShareAppMessage,
  useTabItemTap,
  useRouter,
  useScope,
  useRef,
  useCallback,
  useMemo,
  useImperativeHandle,
  invokeEffects,
  useContext,
  createContext,
  memo,
  getIsUsingDiff,
  setIsUsingDiff
}
