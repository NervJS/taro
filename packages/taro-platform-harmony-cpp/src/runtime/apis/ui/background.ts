import { eventCenter } from '@tarojs/runtime'

import { temporarilyNotSupport } from '../utils'
import { MethodHandler } from '../utils/handler'

export const setBackgroundTextStyle = /* @__PURE__ */ temporarilyNotSupport('setBackgroundTextStyle')

export function setBackgroundColor(options: Taro.setBackgroundColor.Option) {
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler({ name: 'setBackgroundColor', success, fail, complete })

  return new Promise((resolve, reject) => {
    eventCenter.trigger('__taroPageStyle', {
      backgroundColor: options.backgroundColorBottom || options.backgroundColor,
      backgroundColorContext: options.backgroundColorTop || options.backgroundColor
    })

    return handle.success({}, { resolve, reject })
  })
}
