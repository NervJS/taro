import { temporarilyNotSupport } from '../../../utils'

/**
 * 取消监听陀螺仪数据变化事件。
 * 
 * @canUse offGyroscopeChange
 */
export const offGyroscopeChange = /* @__PURE__ */ temporarilyNotSupport('offGyroscopeChange')

export * from './onGyroscopeChange'
export * from './startGyroscope'
export * from './stopGyroscope'
