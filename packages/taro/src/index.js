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
import { noPromiseApis, onAndSyncApis, otherApis, initPxTransform } from './native-apis'

const eventCenter = new Events()

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
  initPxTransform
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
  initPxTransform
}
