import Taro from '../../index'

declare module '../../index' {
  namespace stopLocalServiceDiscovery {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: FailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface FailCallbackResult extends TaroGeneral.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'task not found': 在当前没有处在搜索服务中的情况下调用 stopLocalServiceDiscovery; */
      errMsg: string
    }
  }
  namespace startLocalServiceDiscovery {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: FailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface FailCallbackResult extends TaroGeneral.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'invalid param': serviceType 为空;
       * - 'scan task already exist': 在当前 startLocalServiceDiscovery 发起的搜索未停止的情况下，再次调用 startLocalServiceDiscovery; */
      errMsg: string
    }
  }

  namespace onLocalServiceResolveFail {
    /** mDNS 服务解析失败的事件的回调函数 */
    type Callback = (result: CallbackResult) => void
    interface CallbackResult {
      /** 服务的名称 */
      serviceName: string
      /** 服务的类型 */
      serviceType: string
    }
  }

  namespace onLocalServiceLost {
    /** mDNS 服务离开的事件的回调函数 */
    type Callback = (result: CallbackResult) => void
    interface CallbackResult {
      /** 服务的名称 */
      serviceName: string
      /** 服务的类型 */
      serviceType: string
    }
  }

  namespace onLocalServiceFound {
    /** mDNS 服务发现的事件的回调函数 */
    type Callback = (result: CallbackResult) => void
    interface CallbackResult {
      /** 服务的 ip 地址 */
      ip: string
      /** 服务的端口 */
      port: number
      /** 服务的名称 */
      serviceName: string
      /** 服务的类型 */
      serviceType: string
    }
  }

  namespace onLocalServiceDiscoveryStop {
    /** mDNS 服务停止搜索的事件的回调函数 */
    type Callback = (res: TaroGeneral.CallbackResult) => void
  }

  namespace offLocalServiceResolveFail {
    /** mDNS 服务解析失败的事件的回调函数 */
    type Callback = (res: TaroGeneral.CallbackResult) => void
  }

  namespace offLocalServiceLost {
    /** mDNS 服务离开的事件的回调函数 */
    type Callback = (res: TaroGeneral.CallbackResult) => void
  }

  namespace offLocalServiceFound {
    /** mDNS 服务发现的事件的回调函数 */
    type Callback = (res: TaroGeneral.CallbackResult) => void
  }

  namespace offLocalServiceDiscoveryStop {
    /** mDNS 服务停止搜索的事件的回调函数 */
    type Callback = (res: TaroGeneral.CallbackResult) => void
  }

  interface TaroStatic {
    /** 停止搜索 mDNS 服务
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.stopLocalServiceDiscovery.html
     */
    stopLocalServiceDiscovery(option?: stopLocalServiceDiscovery.Option): void

    /** 开始搜索局域网下的 mDNS 服务。搜索的结果会通过 wx.onLocalService* 事件返回。
     *
     * **注意**
     * 1. wx.startLocalServiceDiscovery 是一个消耗性能的行为，开始 30 秒后会自动 stop 并执行 wx.onLocalServiceDiscoveryStop 注册的回调函数。
     * 2. 在调用 wx.startLocalServiceDiscovery 后，在这次搜索行为停止后才能发起下次 wx.startLocalServiceDiscovery。停止本次搜索行为的操作包括调用 wx.stopLocalServiceDiscovery 和 30 秒后系统自动 stop 本次搜索。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.startLocalServiceDiscovery.html
     */
    startLocalServiceDiscovery(option: startLocalServiceDiscovery.Option): void

    /** 监听 mDNS 服务解析失败的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.onLocalServiceResolveFail.html
     */
    onLocalServiceResolveFail(
      /** mDNS 服务解析失败的事件的回调函数 */
      callback: onLocalServiceResolveFail.Callback
    ): void

    /** 监听 mDNS 服务离开的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.onLocalServiceLost.html
     */
    onLocalServiceLost(
      /** mDNS 服务离开的事件的回调函数 */
      callback: onLocalServiceLost.Callback
    ): void

    /** 监听 mDNS 服务发现的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.onLocalServiceFound.html
     */
    onLocalServiceFound(
      /** mDNS 服务发现的事件的回调函数 */
      callback: onLocalServiceFound.Callback
    ): void

    /** 监听 mDNS 服务停止搜索的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.onLocalServiceDiscoveryStop.html
     */
    onLocalServiceDiscoveryStop(
      /** mDNS 服务停止搜索的事件的回调函数 */
      callback: onLocalServiceDiscoveryStop.Callback
    ): void

    /** 取消监听 mDNS 服务解析失败的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.offLocalServiceResolveFail.html
     */
    offLocalServiceResolveFail(
      /** mDNS 服务解析失败的事件的回调函数 */
      callback: offLocalServiceResolveFail.Callback
    ): void

    /** 取消监听 mDNS 服务离开的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.offLocalServiceLost.html
     */
    offLocalServiceLost(
      /** mDNS 服务离开的事件的回调函数 */
      callback: offLocalServiceLost.Callback
    ): void

    /** 取消监听 mDNS 服务发现的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.offLocalServiceFound.html
     */
    offLocalServiceFound(
      /** mDNS 服务发现的事件的回调函数 */
      callback: offLocalServiceFound.Callback
    ): void

    /** 取消监听 mDNS 服务停止搜索的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.offLocalServiceDiscoveryStop.html
     */
    offLocalServiceDiscoveryStop(
      /** mDNS 服务停止搜索的事件的回调函数 */
      callback: offLocalServiceDiscoveryStop.Callback
    ): void
  }
}
