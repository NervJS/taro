import { hooks } from '@tarojs/runtime'

export const onMemoryWarning = (listener) => {
  hooks.tap('getMemoryLevel', (res) => {
    listener(res)
  })
}

export const offMemoryWarning = (listener) => {
  hooks.off('getMemoryLevel', listener)
}
