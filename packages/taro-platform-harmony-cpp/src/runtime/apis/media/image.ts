import { eventCenter } from '@tarojs/runtime'

import {
  ETS_METHODS_TRIGGER_EVENTNAME,
  MethodHandler,
  temporarilyNotSupport,
} from '../utils'

import type Taro from '@tarojs/taro/types'

const scope = 'media'
const type = 'method'

export const previewImage: typeof Taro.previewImage = function (options) {
  const name = 'previewImage'
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name, success, fail, complete })
  return new Promise((resolve, reject) => {
    eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
      name,
      args: [options],
      scope,
      type,
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject }),
    })
  })
}

export const getImageInfo = function (options) {
  const name = 'getImageInfo'
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name, success, fail, complete })
  return new Promise((resolve, reject) => {
    eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
      name,
      args: [options],
      scope: 'apis',
      type: 'method',
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject }),
    })
  })
}
export const compressImage = function (options) {
  const name = 'compressImage'
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name, success, fail, complete })
  return new Promise((resolve, reject) => {
    eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
      name,
      args: [options],
      scope: 'apis',
      type: 'method',
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject }),
    })
  })
}
export const chooseImage = function (options) {
  const name = 'chooseImage'
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name, success, fail, complete })
  return new Promise((resolve, reject) => {
    eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
      name,
      args: [options],
      scope: 'apis',
      type: 'method',
      successHandler: (res = {}) => {
        return handle.success(res, { resolve, reject })
      },
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject }),
    })
  })
}

export const saveImageToPhotosAlbum = temporarilyNotSupport('saveImageToPhotosAlbum')
