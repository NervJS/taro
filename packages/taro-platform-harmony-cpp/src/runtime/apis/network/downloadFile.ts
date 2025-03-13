import { eventCenter } from '@tarojs/runtime'

import { ETS_METHODS_TRIGGER_EVENTNAME, MethodHandler, validateParams } from '../utils'

import type Taro from '@tarojs/taro/types'

const downloadFileSchema = {
  url: 'String'
}
export const downloadFile: typeof Taro.uploadFile = function (options) {
  let task
  let isComplete = false
  let progressHandles: ((args: { progress: number }) => any)[] = []
  const requestTask: any = new Promise((resolve, reject) => {
    const { url, header, filePath, success, fail, complete } = options
    const handle = new MethodHandler<any>({ name: 'downloadFile', success, fail, complete })

    try {
      validateParams('downloadFile', options, downloadFileSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return handle.fail(res, { resolve, reject })
    }

    const params = {
      url,
      header,
      filePath,
      context: getContext(this),
      success: (requestData: object) => {
        const reswx = {
          data: requestData
        }
        handle.success(reswx, { resolve, reject })
      },

      fail: (data) => {
        handle.fail(data, { resolve, reject })
      },
      complete: () => {
        isComplete = true
      },
      progress: (loaded, total) => {
        const progress = loaded / total
        progressHandles.forEach(fn => fn({ progress }))
      }
    }

    eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
      name: 'downloadFile',
      args: [params],
      scope: 'network',
      type: 'method',
      onInit: (obj) => {
        task = obj
      }
    })
  })

  requestTask.abort = function () {
    task?.delete?.()
  }

  requestTask.onProgressUpdate = (fn: (args: { progress: number }) => any) => {
    if (isComplete) {
      fn({ progress: 1 })
    } else {
      progressHandles.push(fn)
    }
  }

  requestTask.offProgressUpdate = (fn:(args: { progress: number }) => any) => {
    progressHandles = progressHandles.filter(handle => handle !== fn)
  }
  return requestTask
}
