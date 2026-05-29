import { eventCenter } from '@tarojs/runtime'

import { ETS_METHODS_TRIGGER_EVENTNAME, MethodHandler } from '../utils'

import type Taro from '@tarojs/taro/types'

const scope = 'route'
const type = 'method'

export const navigateTo: typeof Taro.navigateTo = (options) => {
  const name = 'navigateTo'
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name, success, fail, complete })
  return new Promise((resolve, reject) => {
    eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
      name,
      args: [options],
      scope,
      type,
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })
  })
}

export const redirectTo: typeof Taro.redirectTo = (options) => {
  const name = 'redirectTo'
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name, success, fail, complete })
  return new Promise((resolve, reject) => {
    eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
      name,
      args: [options],
      scope,
      type,
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })
  })
}

export const navigateBack: typeof Taro.navigateBack = (options = {}) => {
  const name = 'navigateBack'
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name, success, fail, complete })
  return new Promise((resolve, reject) => {
    eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
      name,
      args: [options],
      scope,
      type,
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })
  })
}

export const reLaunch: typeof Taro.reLaunch = (options) => {
  const name = 'reLaunch'
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name, success, fail, complete })
  return new Promise((resolve, reject) => {
    eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
      name,
      args: [options],
      scope,
      type,
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })
  })
}

export const switchTab: typeof Taro.switchTab = (options) => {
  const name = 'switchTab'
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name, success, fail, complete })
  return new Promise((resolve, reject) => {
    eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
      name,
      args: [options],
      scope,
      type,
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })
  })
}
