import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

export const openDocument: typeof Taro.openDocument = (options) => {
  const name = 'openDocument'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const {
      filePath,
      showMenu,
      fileType,
      success,
      fail,
      complete
    } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler({ name, success, fail, complete })

    // options.url must be String
    if (typeof filePath !== 'string') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'filePath',
          correct: 'string',
          wrong: filePath
        })
      }, { resolve, reject })
    }

    // @ts-ignore
    const ret = native.openDocument({
      filePath: filePath,
      showMenu: showMenu,
      fileType: fileType,
      success: (res: any) => {
        return handle.success(res)
      },
      fail: (err: any) => {
        return handle.fail(err)
      }
    })
    return ret
  })
}
