import { eventCenter } from '@tarojs/runtime'

import { ETS_METHODS_TRIGGER_EVENTNAME, MethodHandler, temporarilyNotSupport } from '../utils'

import type Taro from '@tarojs/taro/types'

const scope = 'login'
const type = 'method'

export const pluginLogin = /* @__PURE__ */ temporarilyNotSupport('pluginLogin')

export const login: typeof Taro.login = (options): Promise<Taro.login.SuccessCallbackResult> => {
  const name = 'login'
  const { success, fail, complete } = options || {}
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

export const logout = (): void => {
  const name = 'logout'

  eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
    name,
    scope,
    type,
  })
}

export const checkSession = /* @__PURE__ */ temporarilyNotSupport('checkSession')
