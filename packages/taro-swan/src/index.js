/* eslint-disable camelcase */
import {
  getEnv,
  Events,
  eventCenter,
  ENV_TYPE,
  createRef,
  render,
  internal_safe_get,
  internal_safe_set,
  internal_inline_style,
  internal_get_original,
  interceptors,
  RefsArray,
  handleLoopRef,
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
  useContext,
  createContext,
  memo,
  setIsUsingDiff
} from '@tarojs/taro'
import { shallowEqual } from '@tarojs/utils'

import Component from './component'
import PureComponent from './pure-component'
import createApp from './create-app'
import createComponent from './create-component'
import initNativeApi from './native-api'
import propsManager from './propsManager'
import { getElementById, genCompid } from './util'

export const Taro = {
  Component,
  PureComponent,
  createApp,
  initNativeApi,
  Events,
  eventCenter,
  getEnv,
  createRef,
  render,
  ENV_TYPE,
  internal_safe_get,
  internal_safe_set,
  internal_inline_style,
  createComponent,
  internal_get_original,
  interceptors,
  RefsArray,
  handleLoopRef: handleLoopRef(getElementById),
  propsManager,
  genCompid,
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
  useContext,
  createContext,
  memo,
  shallowEqual,
  setIsUsingDiff
}

export default Taro

initNativeApi(Taro)
