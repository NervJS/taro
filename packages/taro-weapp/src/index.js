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
  interceptors
} from '@tarojs/taro'

import Component from './component'
import PureComponent from './pure-component'
import createApp from './create-app'
import createComponent from './create-component'
import initNativeApi from './native-api'
import propsManager from './propsManager'
import { getElementById, genCompid, genLoopCompid } from './util'
import { useEffect, useLayoutEffect, useReducer, useState, useRef, useCallback, useMemo, useImperativeHandle } from './hooks'

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
  getElementById,
  propsManager,
  interceptors,
  genCompid,
  genLoopCompid,
  useEffect, useLayoutEffect, useReducer, useState, useRef, useCallback, useMemo, useImperativeHandle
}

export default Taro

initNativeApi(Taro)
