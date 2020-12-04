import * as React from 'react'
import { DeviceEventEmitter } from 'react-native'
let emitterList: any[] = []

export function getOpenerEventChannel () {
  return {
    emit (eventName, ...args) {
      DeviceEventEmitter.emit(eventName, ...args)
    },
    on (eventName, callback) {
      emitterList.push({
        eventName,
        cbName: callback.name,
        once: false,
        emitter: DeviceEventEmitter.addListener(eventName, res => callback(res))
      })
    },
    once (eventName, callback) {
      emitterList.push({
        eventName,
        cbName: callback.name,
        once: true,
        emitter: DeviceEventEmitter.addListener(eventName, res => {
          callback(res)
          emitterList.forEach(item => {
            if (item.eventName === eventName && item.once && item.emitter) {
              item.emitter.remove()
              item.emitter = null
            }
          })
        })
      })
    },
    off (eventName, callback) {
      if (callback && typeof callback === 'function') {
        for (let i = 0; i < emitterList.length; i++) {
          const item = emitterList[i]
          if (item.emitter && eventName === item.eventName && callback.name && callback.name === item.cbName) {
            item.emitter.remove()
            item.emitter = null
            break
          }
        }
      } else {
        emitterList.forEach((item) => {
          if (eventName === item.eventName && item.emitter) {
            item.emitter.remove()
            item.emitter = null
          }
        })
      }
      emitterList = emitterList.filter(item => item.emitter)
    }
  }
}
// 挂载至原型，从而this.getOpenerEventChannel()方式使用,对标微信小程序相关方法
Object.assign(React.Component.prototype, {
  getOpenerEventChannel
})
