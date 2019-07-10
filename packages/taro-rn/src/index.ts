/* eslint-disable camelcase */
import {
  getEnv,
  ENV_TYPE,
  Events,
  eventCenter,
  render,
  internal_safe_get,
  internal_safe_set
} from '@tarojs/taro'

import initNativeApi from './native-api'
import { Component, PureComponent } from './component'

import {
  createContext,
  useState,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
  useContext
} from 'react'

const Taro = {
  getEnv,
  ENV_TYPE,
  Events,
  eventCenter,
  render,
  initNativeApi,
  internal_safe_get,
  internal_safe_set,
  Component,
  PureComponent,
  createContext,
  useState,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
  useContext
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
  Component,
  PureComponent,
  createContext,
  useState,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
  useContext
}

initNativeApi(Taro)

export default Taro
