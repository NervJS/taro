import { temporarilyNotSupport } from '../../utils'

// 周期性更新
export const onBackgroundFetchData = /* @__PURE__ */ temporarilyNotSupport('onBackgroundFetchData')
export const getBackgroundFetchToken = /* @__PURE__ */ temporarilyNotSupport('getBackgroundFetchToken')

export * from './getBackgroundFetchData'
export * from './setBackgroundFetchToken'