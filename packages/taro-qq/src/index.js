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
  internal_get_original
} from '@tarojs/taro'

import Component from './component'
import PureComponent from './pure-component'
import createApp from './create-app'
import createComponent from './create-component'
import initNativeApi from './native-api'
import { getElementById } from './util'
import { useEffect, useLayoutEffect, useReducer, useState, useRef, useCallback, useMemo, useImperativeHandle } from './hooks'

export const Taro = {
  Component,
  PureComponent,
  createApp,
  initNativeApi,
  Events,
  eventCenter,
  getEnv,
  render,
  ENV_TYPE,
  createRef,
  internal_safe_get,
  internal_safe_set,
  internal_inline_style,
  createComponent,
  internal_get_original,
  getElementById,
  // eslint-disable-next-line object-property-newline
  useEffect, useLayoutEffect, useReducer, useState, useRef, useCallback, useMemo, useImperativeHandle
}

export default Taro

initNativeApi(Taro)
