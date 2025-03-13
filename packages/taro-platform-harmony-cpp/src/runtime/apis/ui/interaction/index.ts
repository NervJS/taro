import { eventCenter } from '@tarojs/runtime'

import { ETS_METHODS_TRIGGER_EVENTNAME, MethodHandler, temporarilyNotSupport } from '../../utils'

export function showModal (options: any = {}) {
  const name = 'showModal'
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

export function showToast (options: any = {}) {
  const name = 'showToast'
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

export function showActionSheet (options: any = {}) {
  const name = 'showActionSheet'
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

export const hideToast = /* @__PURE__ */ temporarilyNotSupport('hideToast')

export const showLoading = temporarilyNotSupport('showLoading')
export const hideLoading = temporarilyNotSupport('hideLoading')

export const enableAlertBeforeUnload = /* @__PURE__ */ temporarilyNotSupport('enableAlertBeforeUnload')
export const disableAlertBeforeUnload = /* @__PURE__ */ temporarilyNotSupport('disableAlertBeforeUnload')
