import { processApis } from '@tarojs/shared'

import { needPromiseApis } from './apis-list'

import type { IApiDiff } from '@tarojs/shared'

declare const tt: any

const apiDiff: IApiDiff = {
  showToast: {
    options: {
      set: [
        {
          key: 'icon',
          value (options) {
            return options.icon === 'error' ? 'fail' : options.icon
          }
        }
      ]
    }
  }
}

export function transformMeta (api: string, options: Record<string, any>) {
  let apiAlias = api
  Object.keys(apiDiff).forEach(item => {
    const apiItem = apiDiff[item]
    if (api === item) {
      if (apiItem.alias) {
        apiAlias = apiItem.alias
      }
      if (apiItem.options) {
        const change = apiItem.options.change
        const set = apiItem.options.set
        if (change) {
          change.forEach(changeItem => {
            options[changeItem.new] = options[changeItem.old]
          })
        }
        if (set) {
          set.forEach(setItem => {
            options[setItem.key] = typeof setItem.value === 'function' ? setItem.value(options) : setItem.value
          })
        }
      }
    }
  })
  return {
    key: apiAlias,
    options
  }
}



export function initNativeApi (taro) {
  processApis(taro, tt, {
    needPromiseApis,
    transformMeta
  })
}
