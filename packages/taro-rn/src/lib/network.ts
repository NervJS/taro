import NetInfo, { NetInfoStateType, NetInfoState } from '@react-native-community/netinfo'

let _unsubscribe: any = null

let _callbacks: Set<Function> = new Set()

function getTypeFromState(connectionInfo:NetInfoState): keyof Taro.getNetworkType.NetworkType {
  let type: keyof Taro.getNetworkType.NetworkType
  if(connectionInfo.type === NetInfoStateType.wifi) {
    type = NetInfoStateType.wifi
  } else if(connectionInfo.type === NetInfoStateType.cellular && connectionInfo.details.cellularGeneration) {
    type = connectionInfo.details.cellularGeneration
  } else if(connectionInfo.type === NetInfoStateType.none) {
    type = 'none'
  } else {
    type = 'unknown'
  }
  return type
}

export function getNetworkType(opts: Taro.getNetworkType.Option = {}): Promise<Taro.getNetworkType.SuccessCallbackResult> {
  const { success, fail, complete } = opts

  return new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then((connectionInfo) => {
        const res: Taro.getNetworkType.SuccessCallbackResult = {
          errMsg: 'getNetworkType:ok',
          networkType: getTypeFromState(connectionInfo),
        }
        success?.(res)
        complete?.(res)

        resolve(res)
      }).catch((err) => {
        const res: TaroGeneral.CallbackResult = {
          errMsg: err.message
        }
        fail?.(res)
        complete?.(res)

        reject(err)
      })
  })
}

export function onNetworkStatusChange(fnc: Taro.onNetworkStatusChange.Callback): void {
  _callbacks.add(fnc)
  if (!_unsubscribe) {
    _unsubscribe = NetInfo.addEventListener((connectionInfo) => {
      _callbacks.forEach(cb => {
        const { isConnected } = connectionInfo
        cb?.({ isConnected, networkType: getTypeFromState(connectionInfo) })
      })
    })
  }
}

export function offNetworkStatusChange(fnc?: Taro.onNetworkStatusChange.Callback): void {
  if (fnc && typeof fnc === 'function') {
    _callbacks.delete(fnc)
  } else if (fnc === undefined) {
    _callbacks.clear()
    _unsubscribe?.()
    _unsubscribe = null
  } else {
    console.warn('offNetworkStatusChange failed')
  }
}
