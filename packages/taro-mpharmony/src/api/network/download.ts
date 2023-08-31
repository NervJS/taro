import { isFunction } from '@tarojs/shared'
import { getParameterError, shouldBeObject } from 'src/utils'

export const downloadFile = (options) => {
  const name = 'downloadFile'

  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    return Promise.reject(res)
  }

  const { url, success, fail, complete, ...otherOptions } = options as Exclude<typeof options, undefined>
  if (typeof url !== 'string') {
    const res = {
      errMsg: getParameterError({
        para: 'url',
        correct: 'string',
        wrong: url,
      }),
    }
    isFunction(fail) && fail(res)
    isFunction(complete) && complete(res)
    return Promise.reject(res)
  }
  // @ts-ignore
  const task = native.downloadFile({
    url,
    ...otherOptions,
    success: (res: any) => {
      isFunction(success) && success(res)
    },
    fail: (res: any) => {
      isFunction(fail) && fail(res)
    },
    complete: (res: any) => {
      isFunction(complete) && complete(res)
    },
  })
  const promise = Promise.resolve(task)
  const taskMethods = ['abort', 'onHeadersReceived', 'offHeadersReceived', 'onProgressUpdate', 'offProgressUpdate']
  task &&
    taskMethods.forEach((method) => {
      if (method in task) {
        promise[method] = task[method].bind(task)
      }
    })
  return promise
}
