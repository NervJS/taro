/* eslint-disable camelcase */
import Component from './component'
import { get as internal_safe_get } from './internal/safe-get'
import { set as internal_safe_set } from './internal/safe-set'
import { inlineStyle as internal_inline_style } from './internal/inline-style'
import { dynamicRecursive as internal_dynamic_recursive } from './internal/dynamic-recursive'
import { getEnv, ENV_TYPE } from './env'
import Events from './events'
import render from './render'
import { noPromiseApis, onAndSyncApis, otherApis } from './native-apis'

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
  internal_dynamic_recursive,
  internal_inline_style,
  noPromiseApis,
  onAndSyncApis,
  otherApis
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
  internal_dynamic_recursive,
  internal_inline_style,
  noPromiseApis,
  onAndSyncApis,
  otherApis
}
