import { eventCenter } from '@tarojs/runtime'

import { ETS_METHODS_TRIGGER_EVENTNAME, MethodHandler } from '../utils'

import type { TaroAny } from '@tarojs/runtime'

const scope = 'taskpool'
const type = 'method'

// TaskPool 专属方法
export const triggerTaskPoolMethods = ({
  name = '',
  args = [],
  complete,
  fail,
  success,
}: {
  name?: string
  args?: TaroAny[]
  complete?: (res: TaroAny) => void
  fail?: (res: TaroAny) => void
  success?: (res: TaroAny) => void
} = {}) => {
  if (!name) {
    throw new Error('triggerTaskPoolMethods 方法必须传入 name 参数')
  }

  const handle = new MethodHandler({ name, success, fail, complete })
  return new Promise((resolve, reject) => {
    eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
      name,
      args,
      scope,
      type,
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })
  })
}
