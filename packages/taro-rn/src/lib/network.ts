import NetInfo from '@react-native-community/netinfo'

let _unsubscribe: any = null

let _callbacks: Set<Function> = new Set()

export function getNetworkType(opts: Taro.getNetworkType.Option = {}): Promise<Taro.getNetworkType.SuccessCallbackResult> {
  const { success, fail, complete } = opts
  const res: any = {}

  return new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then((connectionInfo) => {
        res.networkType = connectionInfo.type
        res.errMsg = 'getNetworkType:ok'
        success?.(res)
        complete?.(res)

        resolve(res)
      }).catch((err) => {
        res.errMsg = err.message
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
        const { type, isConnected } = connectionInfo
        cb?.({ isConnected, networkType: type })
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
