declare namespace Taro {
  /** Taro.setStorage 的同步版本
   * @supported weapp, h5
   * @example
   * ```tsx
   * Taro.setStorage({
   *   key:"key",
   *   data:"value"
   * })
   * ```
   * @example
   * ```tsx
   * try {
   *   Taro.setStorageSync('key', 'value')
   * } catch (e) { }
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorageSync.html
   */
  function setStorageSync(
    /** 本地缓存中指定的 key */
    key: string,
    /** 需要存储的内容。只支持原生类型、Date、及能够通过`JSON.stringify`序列化的对象。 */
    data: any,
  ): void

  namespace setStorage {
    interface Option {
      /** 需要存储的内容。只支持原生类型、Date、及能够通过`JSON.stringify`序列化的对象。 */
      data: any
      /** 本地缓存中指定的 key */
      key: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 将数据存储在本地缓存中指定的 key 中。会覆盖掉原来该 key 对应的内容。除非用户主动删除或因存储空间原因被系统清理，否则数据都一直可用。单个 key 允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB。
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.setStorage({
   *   key:"key",
   *   data:"value"
   * })
   * ```
   * ```tsx
   * try {
   *   Taro.setStorageSync('key', 'value')
   * } catch (e) { }
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorage.html
   */
  function setStorage(option: setStorage.Option): Promise<General.CallbackResult>

  /**
   * 从本地缓存中同步移除指定 key 。
   * @supported weapp, h5
   * @example
   * ```tsx
   * try {
   *   Taro.removeStorageSync('key')
   * } catch (e) {
   *   // Do something when catch error
   * }
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.removeStorageSync.html
   */
  function removeStorageSync(key: string): void

  /** Taro.removeStorage 的同步版本
   * @example
   * ```tsx
   * Taro.removeStorage({
   *   key: 'key',
   *   success: function (res) {
   *     console.log(res)
   *   }
   * })
   * ```
   *
   * ```tsx
   * try {
   *   Taro.removeStorageSync('key')
   * } catch (e) {
   *   // Do something when catch error
   * }
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.removeStorageSync.html
   */
  function removeStorageSync(
    /** 本地缓存中指定的 key */
    key: string,
  ): void

  namespace removeStorage {
    interface Option {
      /** 本地缓存中指定的 key */
      key: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /** 从本地缓存中移除指定 key
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.removeStorage({
   *   key: 'key',
   *   success: function (res) {
   *     console.log(res)
   *   }
   * })
   * ```
   *
   * ```tsx
   * try {
   *   Taro.removeStorageSync('key')
   * } catch (e) {
   *   // Do something when catch error
   * }
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.removeStorage.html
   */
  function removeStorage(option: removeStorage.Option): Promise<General.CallbackResult>

  /** Taro.getStorage 的同步版本
   * @supported weapp, h5
   * @example
   * ```tsx
   * Taro.getStorage({
   *   key: 'key',
   *   success: function (res) {
   *     console.log(res.data)
   *   }
   * })
   * ```
   *
   * ```tsx
   * try {
   *   var value = Taro.getStorageSync('key')
   *   if (value) {
   *     // Do something with return value
   *   }
   * } catch (e) {
   *   // Do something when catch error
   * }
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageSync.html
   */
  function getStorageSync(
    /** 本地缓存中指定的 key */
    key: string,
  ): any

  namespace getStorageInfoSync {
    interface Option {
      /** 当前占用的空间大小, 单位 KB */
      currentSize: number
      /** 当前 storage 中所有的 key */
      keys: string[]
      /** 限制的空间大小，单位 KB */
      limitSize: number
    }
  }

  /** Taro.getStorageInfo 的同步版本
   * @supported weapp, h5
   * @example
   * ```tsx
   * Taro.getStorageInfo({
   *   success: function (res) {
   *     console.log(res.keys)
   *     console.log(res.currentSize)
   *     console.log(res.limitSize)
   *   }
   * })
   * ```
   *
   * ```tsx
   * try {
   *   const res = Taro.getStorageInfoSync()
   *   console.log(res.keys)
   *   console.log(res.currentSize)
   *   console.log(res.limitSize)
   * } catch (e) {
   *   // Do something when catch error
   * }
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageInfoSync.html
   */
  function getStorageInfoSync(): getStorageInfoSync.Option

  namespace getStorageInfo {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (option: SuccessCallbackOption) => void
    }

    interface SuccessCallbackOption {
      /** 当前占用的空间大小, 单位 KB */
      currentSize: number
      /** 当前 storage 中所有的 key */
      keys: string[]
      /** 限制的空间大小，单位 KB */
      limitSize: number
    }
  }

  /** 异步获取当前storage的相关信息
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.getStorageInfo({
   *   success: function (res) {
   *     console.log(res.keys)
   *     console.log(res.currentSize)
   *     console.log(res.limitSize)
   *   }
   * })
   * ```
   *
   * ```tsx
   * try {
   *   const res = Taro.getStorageInfoSync()
   *   console.log(res.keys)
   *   console.log(res.currentSize)
   *   console.log(res.limitSize)
   * } catch (e) {
   *   // Do something when catch error
   * }
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageInfo.html
   */
  function getStorageInfo(option?: getStorageInfo.Option): Promise<General.CallbackResult>

  namespace getStorage {
    interface Option {
      /** 本地缓存中指定的 key */
      key: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** key对应的内容 */
      data: any
      /** 调用结果 */
      errMsg: string
    }
  }

  /** 从本地缓存中异步获取指定 key 的内容
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.getStorage({
   *   key: 'key',
   *   success: function (res) {
   *     console.log(res.data)
   *   }
   * })
   * ```
   *
   * ```tsx
   * try {
   *   var value = Taro.getStorageSync('key')
   *   if (value) {
   *     // Do something with return value
   *   }
   * } catch (e) {
   *   // Do something when catch error
   * }
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorage.html
   */
  function getStorage(option: getStorage.Option): Promise<getStorage.SuccessCallbackResult>

  /** Taro.clearStorage 的同步版本
   * @supported weapp, h5
   * @example
   * ```tsx
   * Taro.clearStorage()
   * ```
   *
   * ```tsx
   * try {
   *   Taro.clearStorageSync()
   * } catch(e) {
   * // Do something when catch error
   * }
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.clearStorageSync.html
   */
  function clearStorageSync(): void

  namespace clearStorage {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 清理本地数据缓存
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.clearStorage()
   * ```
   *
   * ```tsx
   * try {
   *   Taro.clearStorageSync()
   * } catch(e) {
   *   // Do something when catch error
   * }
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.clearStorage.html
   */
  function clearStorage(option?: clearStorage.Option): Promise<General.CallbackResult>
}
