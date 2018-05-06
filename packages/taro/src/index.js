/* eslint-disable camelcase */
import Component from './component'
import { get as internal_safe_get } from './internal/safe-get'
import { dynamicRecursive as internal_dynamic_recursive } from './internal/dynamic-recursive'
import { getEnv, ENV_TYPE } from './env'
import Events from './events'

const eventCenter = new Events()

export {
  Component,
  Events,
  eventCenter,
  getEnv,
  ENV_TYPE,
  internal_safe_get,
  internal_dynamic_recursive
}

export default {
  Component,
  Events,
  eventCenter,
  getEnv,
  ENV_TYPE,
  internal_safe_get,
  internal_dynamic_recursive
}
