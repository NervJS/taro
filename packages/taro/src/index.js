/* eslint-disable camelcase */
import Component from './component'
import { get as internal_safe_get } from './internal/safe-get'
import { dynamicRecursive as internal_dynamic_recursive } from './internal/dynamic-recursive'
import { getEnv, ENV_TYPE } from './env'

export {
  Component,
  getEnv,
  ENV_TYPE,
  internal_safe_get,
  internal_dynamic_recursive
}

export default {
  Component,
  getEnv,
  ENV_TYPE,
  internal_safe_get,
  internal_dynamic_recursive
}
