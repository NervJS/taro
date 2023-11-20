import { isFunction } from '@tarojs/shared'
import { getParameterError, shouldBeObject } from 'src/utils'

/**
 * 下载文件资源到本地
 * 
 * @canUse downloadFile
 * @__object [url, filePath, header, timeout, withCredentials]
 * @__success [filePath, statusCode, tempFilePath, header, dataLength, cookies, profile]
 */

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

  /**
   * 一个可以监听下载进度变化事件，以及取消下载任务的对象
   * 
   * @canUse DownloadTask
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
