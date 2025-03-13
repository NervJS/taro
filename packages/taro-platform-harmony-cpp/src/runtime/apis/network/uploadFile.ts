import { eventCenter } from '@tarojs/runtime'

import { ETS_METHODS_TRIGGER_EVENTNAME, MethodHandler, validateParams } from '../utils'

import type { TaroAny } from '@tarojs/runtime'
import type Taro from '@tarojs/taro/types'

const uploadSchema = {
  url: 'String',
  // filePath: 'String',
  // name: 'String'
}
export const uploadFile: typeof Taro.uploadFile = function (options) {
  let task
  let isComplete = false
  let progressHandles: ((args: { progress: number }) => any)[] = []
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

    const file = {
      url: filePath,
      name
    }
    const files = [file]

    const param: Record<string, TaroAny> = {
      url,
      files,
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

    if (formData) {
      const rData: Record<string, any>[] = []
      Object.keys(formData).forEach((key: string) => {
        const rDataEle = {
          name: key,
          value: formData[key],
        }
        rData.push(rDataEle)
      })
      param.data = rData
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
    task?.delete?.()
  }

  requestTask.onProgressUpdate = (fn:(args: { progress: number }) => any) => {
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
