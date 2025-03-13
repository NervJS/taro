import connection from '@ohos.net.connection'

import { CallbackManager } from '../../../utils/handler'
import { TurboModule } from '../TurboModule'

import type { TaroAny } from '@tarojs/runtime'

const netCon = connection.createNetConnection?.()

function getNetworkValue () {
  let networkType = 'unknown'
  let metered = false
  const netHandle = connection.getDefaultNetSync()
  const getNetCapabilitiesSync = connection.getNetCapabilitiesSync(netHandle)
  if (getNetCapabilitiesSync) {
    const { networkCap = [], bearerTypes = [] } = getNetCapabilitiesSync

    switch (bearerTypes[0]) {
      case connection.NetBearType.BEARER_CELLULAR:
        networkType = '4g'
        break
      case connection.NetBearType.BEARER_WIFI:
        networkType = 'WiFi'
        break
      case connection.NetBearType.BEARER_ETHERNET:
        networkType = '4g'
        break
      case connection.NetBearType.BEARER_VPN:
        networkType = 'VPN'
        break
      default:
        networkType = 'unknown'
        break
    }
    metered = !networkCap.find(item => item === connection.NetCap.NET_CAPABILITY_NOT_METERED)
  }

  return { networkType, metered }
}

const networkStatusManager = new CallbackManager()

const networkStatusListener = (error: any) => {
  if (error) {
    return networkStatusManager.trigger({ isConnected: false, networkType: 'none' })
  }
  const res = getNetworkValue()
  const networkType = res.networkType || 'unknown'
  const isConnected = networkType !== 'none'
  const metered = res.metered
  const obj = { isConnected, networkType, metered }
  networkStatusManager.trigger(obj)
}

export class NetworkManagerTurboModule extends TurboModule {
  public static readonly NAME = 'NetworkManager'

  async getNetworkType() {
    const data = await connection.getDefaultNet().then((netHandle) => {
      let networkType: any = 'none'
      let metered = false
      if (netHandle.netId !== 0) {
        const res = getNetworkValue()
        networkType = res.networkType
        metered = res.metered
      }

      return {
        networkType: networkType || 'unknown',
        metered: metered
      }
    })

    return data
  }

  onNetworkStatusChange(callback: TaroAny) {
    networkStatusManager.add(callback)
    if (networkStatusManager.count() === 1) {
      netCon.register(networkStatusListener)
    }
  }

  offNetworkStatusChange(callback: TaroAny) {
    networkStatusManager.remove(callback)
    if (networkStatusManager.count() === 0) {
      netCon.unregister(networkStatusListener)
    }
  }
}
