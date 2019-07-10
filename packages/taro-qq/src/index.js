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
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
  useRef,
  useCallback,
  useMemo,
  useImperativeHandle,
  useContext,
  createContext,
  memo
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
  render,
  ENV_TYPE,
  createRef,
  internal_safe_get,
  internal_safe_set,
  internal_inline_style,
  createComponent,
  internal_get_original,
  getElementById,
  propsManager,
  interceptors,
  genCompid,
  // eslint-disable-next-line object-property-newline
  useEffect, useLayoutEffect, useReducer, useState, useRef, useCallback, useMemo,
  useImperativeHandle,
  useContext,
  createContext,
  memo,
  shallowEqual
}

export default Taro

initNativeApi(Taro)
