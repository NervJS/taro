import { isFunction } from '@tarojs/shared'
import { getParameterError, shouldBeObject } from 'src/utils'

/**
 * 将本地资源上传到服务器
 * 
 * @canUse uploadFile
 * @__object [url, filePath, name, header, formData, timeout, fileName, withCredentials]
 * @__success [data, statusCode, header, cookies]
 */
export const uploadFile = (options) => {
  const apiName = 'uploadFile'

  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${apiName}:fail ${isObject.msg}` }
    return Promise.reject(res)
  }

  const { url, filePath, name, success, fail, complete, ...otherOptions } = options as Exclude<
    typeof options,
  undefined
  >
  const requireOptions = { url, filePath, name }
  for (const option in requireOptions) {
    if (typeof requireOptions[option] !== 'string') {
      const res = {
        errMsg: getParameterError({
          para: option,
          correct: 'string',
          wrong: requireOptions[option],
        }),
      }
      isFunction(fail) && fail(res)
      isFunction(complete) && complete(res)
      return Promise.reject(res)
    }
  }

  // @ts-ignore
  const task = native.uploadFile({
    url,
    filePath,
    name,
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

  /**
   * 一个可以监听上传进度变化事件，以及取消上传任务的对象
   * 
   * @canUse UploadTask
   * @__class [abort, onProgressUpdate, offProgressUpdate, onHeadersReceived, offHeadersReceived]
   */
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

