import NetInfo from '@react-native-community/netinfo'

let unsubscribe: any = null

export function getNetworkType (opts: Taro.getNetworkType.Option = {}): Promise<Taro.getNetworkType.SuccessCallbackResult> {
  const { success, fail, complete } = opts
  const res: any = {}

  return new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then((connectionInfo) => {
        res.networkType = connectionInfo.type
        res.errMsg = 'getNetworkType:ok'
        success && success(res)
        complete && complete(res)

        resolve(res)
      }).catch((err) => {
        res.errMsg = err.message
        fail && fail(res)
        complete && complete(res)

        reject(err)
      })
  })
}

export function onNetworkStatusChange (onNetworkStatusChange: Taro.onNetworkStatusChange.Callback): void {
  function changeCallback (connectionInfo) {
    const { type, isConnected } = connectionInfo
    onNetworkStatusChange && onNetworkStatusChange({
      isConnected,
      networkType: type
    })
  }
  unsubscribe = NetInfo.addEventListener(changeCallback)
}

export function offNetworkStatusChange (): void {
  unsubscribe()
  unsubscribe = null
}
