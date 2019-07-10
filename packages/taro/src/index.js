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
import { createRef, commitAttachRef, detachAllRef } from './ref'
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
  useContext
} from './hooks'
import { Current } from './current'
import { createContext } from './create-context'
import { memo } from './memo'

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
  noPromiseApis,
  onAndSyncApis,
  otherApis,
  initPxTransform,
  createRef,
  commitAttachRef,
  detachAllRef,
  Link,
  interceptors,
  Current,
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
  createContext,
  memo
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
  noPromiseApis,
  onAndSyncApis,
  otherApis,
  initPxTransform,
  createRef,
  commitAttachRef,
  detachAllRef,
  Link,
  interceptors,
  Current,
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
  createContext,
  memo
}
