import { eventCenter } from '@tarojs/runtime'

import { ETS_METHODS_TRIGGER_EVENTNAME, MethodHandler, validateParams } from '../utils'

import type { TaroAny } from '@tarojs/runtime'
import type Taro from '@tarojs/taro/types'

const uploadSchema = {
  url: 'String',
  // filePath: 'String',
  // name: 'String'
}

interface IUploadTask {
  abort: () => void
  onProgressUpdate: (callback: (res: TaroAny) => void) => void
  offProgressUpdate: (callback?: (res: TaroAny) => void) => void
  onHeadersReceived: (callback: (res: TaroAny) => void) => void
  offHeadersReceived: (callback?: (res: TaroAny) => void) => void
}

export const uploadFile: typeof Taro.uploadFile = function (options) {
  let task: IUploadTask
  let isComplete = false
  const progressHandles: ((args: { progress: number }) => any)[] = []
  const requestTask: any = new Promise((resolve, reject) => {
    // let timer
    const { url, filePath, name, formData, header = {}, success, fail, complete } = options

    const handle = new MethodHandler<any>({ name: 'uploadFile', success, fail, complete })

    // -> 1.校验url格式
    try {
      validateParams('uploadFile', options, uploadSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return handle.fail(res, { resolve, reject })
    }


    const param: Record<string, TaroAny> = {
      url,
      filePath,
      formData,
      name,
      method: 'POST',
      context: getContext(this),
      header,
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
      name: 'uploadFile',
      args: [param],
      scope: 'network',
      type: 'method',
      onInit: (obj) => {
        task = obj
      }
    })
  })

  requestTask.abort = function () {
    task?.abort?.()
  }

  requestTask.onProgressUpdate = (fn:(args: { progress: number }) => any) => {
    if (isComplete) {
      fn({ progress: 1 })
    } else {
      task?.onProgressUpdate(fn)
    }
  }

  requestTask.offProgressUpdate = (fn:(args: { progress: number }) => any) => {
    task?.offProgressUpdate?.(fn)
  }

  requestTask.onHeadersReceived = (fn:(args: { header: object }) => any) => {
    task?.onHeadersReceived?.(fn)
  }

  requestTask.offHeadersReceived = (fn:(args: { header: object }) => any) => {
    task?.offHeadersReceived?.(fn)
  }

  return requestTask
}
