import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 获取本地已保存的文件列表
 * 
 * @canUse getSavedFileList
 * @__success [fileList]
 */
export const getSavedFileList: typeof Taro.getSavedFileList = (options) => {
  const name = 'getSavedFileList'

  // options must be an Object
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { success, fail, complete } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler<{
    fileList?: object
    errMsg?: string
  }>({ name, success, fail, complete })

  return new Promise<Taro.getSavedFileList.SuccessCallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.getSavedFileList({
      success: (res: any) => {
        const result: Taro.getSavedFileList.SuccessCallbackResult = {
          fileList: res.fileList,
          errMsg: res.errMsg,
        }
        handle.success(result, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
