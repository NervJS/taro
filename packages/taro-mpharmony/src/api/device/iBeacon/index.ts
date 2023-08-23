import { temporarilyNotSupport } from '../../../utils'

// 蓝牙-信标(Beacon)
export const offBeaconUpdate = /* @__PURE__ */ temporarilyNotSupport('offBeaconUpdate')
export const offBeaconServiceChange = /* @__PURE__ */ temporarilyNotSupport('offBeaconServiceChange')

export * from './getBeacons'
export * from './onBeaconServiceChange'
export * from './onBeaconUpdate'
export * from './startBeaconDiscovery'
export * from './stopBeaconDiscovery'
