import Taro from '../../index'

declare module '../../index' {
  /** @ignore */
  type TypedArray =
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array

  namespace setStorage {
    interface Option {
      /** 需要存储的内容。只支持原生类型、Date、及能够通过`JSON.stringify`序列化的对象。 */
      data: any
      /** 本地缓存中指定的 key */
      key: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace removeStorage {
    interface Option {
      /** 本地缓存中指定的 key */
      key: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace getStorageInfoSync {
    interface Option {
      /** 当前占用的空间大小, 单位 KB */
      currentSize: number
      /** 当前 storage 中所有的 key */
      keys: string[]
      /** 限制的空间大小，单位 KB */
      limitSize: number
      /** 是否执行成功
       * @supported alipay
       */
      success?: boolean
    }
  }

  namespace getStorageInfo {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
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

  namespace getStorage {
    interface Option<T> {
      /** 本地缓存中指定的 key */
      key: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult<T>) => void
    }
    interface SuccessCallbackResult<T> extends TaroGeneral.CallbackResult {
      /** key对应的内容 */
      data: T
      /** 调用结果 */
      errMsg: string
    }
  }

  namespace clearStorage {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace batchSetStorageSync {
    interface Option {
      /** [{ key, value }] */
      kvList: kv[]
    }
    interface kv {
      /** key 本地缓存中指定的 key */
      key: string
      /** data 需要存储的内容。只支持原生类型、Date、及能够通过JSON.stringify序列化的对象。*/
      value: any
    }
  }

  namespace batchSetStorage {
    interface Option {
      /** [{ key, value }] */
      kvList: kv[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface kv {
      /** key 本地缓存中指定的 key */
      key: string
      /** data 需要存储的内容。只支持原生类型、Date、及能够通过JSON.stringify序列化的对象。*/
      value: any
    }
  }

  namespace batchGetStorage {
    interface Option {
      /** 本地缓存中指定的 keyList */
      keyList: string[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  interface TaroStatic {
    /** Taro.setStorage 的同步版本
     * @supported weapp, alipay, swan, jd, qq, tt, h5, harmony_hybrid
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
    setStorageSync(
      /** 本地缓存中指定的 key */
      key: string,
      /** 需要存储的内容。只支持原生类型、Date、及能够通过`JSON.stringify`序列化的对象。 */
      data: any,
    ): void

    /** 将数据存储在本地缓存中指定的 key 中。会覆盖掉原来该 key 对应的内容。除非用户主动删除或因存储空间原因被系统清理，否则数据都一直可用。单个 key 允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB。
     * @supported weapp, alipay, swan, jd, qq, tt, h5, rn, harmony_hybrid
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
    setStorage(option: setStorage.Option): Promise<TaroGeneral.CallbackResult>

    /** 根据 URL 销毁存在内存中的数据
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.revokeBufferURL.html
     */
    revokeBufferURL(
      /** 需要销毁的二进制数据 URL */
      url: string
    ): void

    /** Taro.removeStorage 的同步版本
     * @supported weapp, alipay, swan, jd, qq, tt, h5, harmony_hybrid
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
    removeStorageSync(
      /** 本地缓存中指定的 key */
      key: string,
    ): void

    /** 从本地缓存中移除指定 key
     * @supported weapp, alipay, swan, jd, qq, tt, h5, rn, harmony_hybrid
     * @example
     * ```tsx
     * Taro.removeStorage({
     *   key: 'key',
     *   success: function (res) {
     *     console.log(res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.removeStorage.html
     */
    removeStorage(option: removeStorage.Option): Promise<TaroGeneral.CallbackResult>

    /** Taro.getStorage 的同步版本
     * @supported weapp, alipay, swan, jd, qq, tt, h5, harmony_hybrid
     * @example
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
    getStorageSync<T = any>(
      /** 本地缓存中指定的 key */
      key: string,
    ): T

    /** Taro.getStorageInfo 的同步版本
     * @supported weapp, alipay, swan, jd, qq, tt, h5, harmony_hybrid
     * @example
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
    getStorageInfoSync(): getStorageInfoSync.Option

    /** 异步获取当前storage的相关信息
     * @supported weapp, alipay, swan, jd, qq, tt, h5, rn, harmony_hybrid
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
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageInfo.html
     */
    getStorageInfo(option?: getStorageInfo.Option): Promise<TaroGeneral.CallbackResult>

    /** 从本地缓存中异步获取指定 key 的内容
     * @supported weapp, alipay, swan, jd, qq, tt, h5, rn, harmony_hybrid
     * @example
     * ```tsx
     * Taro.getStorage({
     *   key: 'key',
     *   success: function (res) {
     *     console.log(res.data)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorage.html
     */
    getStorage<T = any>(option: getStorage.Option<T>): Promise<getStorage.SuccessCallbackResult<T>>

    /** 根据传入的 buffer 创建一个唯一的 URL 存在内存中
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.createBufferURL.html
     */
    createBufferURL(
      /** 需要存入内存的二进制数据 */
      buffer: ArrayBuffer | TypedArray
    ): void

    /** Taro.clearStorage 的同步版本
     * @supported weapp, alipay, swan, jd, qq, tt, h5, harmony_hybrid
     * @example
     * ```tsx
     * try {
     *   Taro.clearStorageSync()
     * } catch(e) {
     * // Do something when catch error
     * }
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.clearStorageSync.html
     */
    clearStorageSync(): void

    /** 清理本地数据缓存
     * @supported weapp, alipay, swan, jd, qq, tt, h5, rn, harmony_hybrid
     * @example
     * ```tsx
     * Taro.clearStorage()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.clearStorage.html
     */
    clearStorage(option?: clearStorage.Option): Promise<TaroGeneral.CallbackResult>

    /** 将数据批量存储在本地缓存中指定的 key 中。
     * 会覆盖掉原来该 key 对应的内容。除非用户主动删除或因存储空间原因被系统清理，否则数据都一直可用。
     * 单个 key 允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB。
     * @supported weapp
     * @example
     * ```tsx
     * try {
     *   Taro.batchSetStorageSync([{key: 'key', value: 'value'}])
     * } catch (e) { }
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.batchGetStorageSync.html
     */
    batchSetStorageSync(option: batchSetStorageSync.Option): void

    /** 将数据批量存储在本地缓存中指定的 key 中。会覆盖掉原来该 key 对应的内容。
     * 除非用户主动删除或因存储空间原因被系统清理，否则数据都一直可用。
     * 单个 key 允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.batchGetStorage({
     *   keyList: ['key']
     *   success(res) {
     *     console.log(res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.batchGetStorage.html
     */
    batchSetStorage(option: batchSetStorage.Option): Promise<TaroGeneral.CallbackResult>

    /** 从本地缓存中同步批量获取指定 key 的内容。
     * @supported weapp
     * @example
     * ```tsx
     * try {
     *   var valueList = Taro.batchGetStorageSync(['key'])
     *   if (valueList) {
     *     // Do something with return value
     *   }
     * } catch (e) {
     *   // Do something when catch error
     * }
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.batchGetStorageSync.html
     */
    batchGetStorageSync<T = any>(
      /** 本地缓存中指定的 key 数组 */
      keyList: string[]
    ): T[]

    /** 从本地缓存中异步批量获取指定 key 的内容。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.batchGetStorage({
     *   keyList: ['key'],
     *   success(res) {
     *     console.log(res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.batchGetStorage.html
     */
    batchGetStorage(option: batchGetStorage.Option): Promise<TaroGeneral.CallbackResult>
  }
}
