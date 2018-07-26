const noop = () => {}

export default class NetInfo {
  constructor (connectionType = 'wifi', effectiveConnectionType = '4g') {
    this.connectionType = connectionType
    this.effectiveConnectionType = effectiveConnectionType
    this.eventMaps = {}
    this.connectedStatus = connectionType === 'wifi' || connectionType === 'cellular'
  }

  isConnected = {
    fetch: this.fetch.bind(this)
  }

  fetch () {
    return new Promise((resolve, reject) => {
      resolve(this.connectedStatus)
    })
  }

  getConnectionInfo () {
    return new Promise((resolve, reject) => {
      const res = {}
      res.type = this.connectionType
      res.effectiveType = this.effectiveConnectionType
      resolve(res)
    })
  }

  addEventListener (eventName, listener = noop) {
    this.eventMaps[eventName] = listener
  }

  removeEventListener (eventName, listener = noop) {
    if (this.eventMaps[eventName] === listener) {
      delete this.eventMaps[eventName]
    }
  }

  // 纯粹为了模拟测试用，主动更改网络状态
  changeNetworkType (connectionType, effectiveConnectionType = '4g') {
    if (this.connectionType !== connectionType) {
      this.connectionType = connectionType
      if (connectionType === 'cellular') {
        this.effectiveConnectionType = effectiveConnectionType
      }
      this.connectedStatus = connectionType === 'wifi' || connectionType === 'cellular'

      const res = {}
      res.type = this.connectionType
      res.effectiveType = this.effectiveConnectionType
      const fn = this.eventMaps['connectionChange']
      fn && fn(res)
    }
  }
}
