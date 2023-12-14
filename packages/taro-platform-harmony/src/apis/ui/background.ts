// import window from '@ohos.window'
// import { Current } from '@tarojs/runtime'
import { eventCenter } from '@tarojs/runtime/dist/runtime.esm'

import { MethodHandler } from '../utils/handler'

// import { callAsyncFail, callAsyncSuccess } from '../utils'


// const windowClassPromise = (Current as any).contextPromise
//   .then(context => {
//     return window.getTopWindow(context)
//   })

export function setBackgroundColor(options: Taro.setBackgroundColor.Option) {
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler({ name: 'setBackgroundColor', success, fail, complete })

  return new Promise((resolve, reject) => {
    eventCenter.trigger('__taroPageStyle', {
      backgroundColor: options.backgroundColor || options.backgroundColorTop || options.backgroundColorBottom,
    })

    return handle.success({}, { resolve, reject })
    // windowClassPromise.then(windowClass => {
    //   windowClass.setBackgroundColor(color).then(() => {
    //     const res = { errMsg: 'setBackgroundColor:ok' }
    //     callAsyncSuccess(resolve, res, options)
    //   }, (error) => {
    //     const res = { errMsg: 'setBackgroundColor:fail' + error }
    //     callAsyncFail(reject, res, options)
    //   })
    // })
  })
}
