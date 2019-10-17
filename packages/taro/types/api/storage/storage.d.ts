declare namespace Taro {
  /**
   * 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。
   *
   * **参数说明：**
   *
   ```javascript
   try {
       Taro.setStorageSync('key', 'value')
   } catch (e) {
   }
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorageSync.html
   */
  function setStorageSync(key: string, data: any | string): void

  namespace setStorage {
    type Param = {
      /**
       * 本地缓存中的指定的 key
       */
      key: string
      /**
       * 需要存储的内容
       */
      data: any | string
    }
  }
  /**
   * 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.setStorage({
     key:"key",
     data:"value"
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorage.html
   */
  function setStorage(OBJECT: setStorage.Param): Promise<any>

  /**
   * 从本地缓存中同步移除指定 key 。
   *
   * **示例代码：**
   *
   ```javascript
   try {
     Taro.removeStorageSync('key')
   } catch (e) {
     // Do something when catch error
   }
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.removeStorageSync.html
   */
  function removeStorageSync(key: string): void

  namespace removeStorage {
    type Param = {
      /**
       * 本地缓存中的指定的 key
       */
      key: string
    }
  }
  /**
   * 从本地缓存中异步移除指定 key 。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.removeStorage({
     key: 'key',
     success: function(res) {
       console.log(res.data)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.removeStorage.html
   */
  function removeStorage(OBJECT: removeStorage.Param): Promise<any>

  /**
   * 从本地缓存中同步获取指定 key 对应的内容。
   *
   * **示例代码：**
   *
   ```javascript
   try {
     var value = Taro.getStorageSync('key')
     if (value) {
         // Do something with return value
     }
   } catch (e) {
     // Do something when catch error
   }
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageSync.html
   */
  function getStorageSync(key: string): any | undefined

  namespace getStorageInfoSync {
    type Return = {
      /**
       * 当前storage中所有的key
       */
      keys: string[]
      /**
       * 当前占用的空间大小, 单位kb
       */
      currentSize: number
      /**
       * 限制的空间大小，单位kb
       */
      limitSize: number
    }
  }
  /**
   * 同步获取当前storage的相关信息
   *
   * **示例代码：**
   *
   ```javascript
   try {
     var res = Taro.getStorageInfoSync()
     console.log(res.keys)
     console.log(res.currentSize)
     console.log(res.limitSize)
   } catch (e) {
     // Do something when catch error
   }
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageInfoSync.html
   */
  function getStorageInfoSync(): getStorageInfoSync.Return

  namespace getStorageInfo {
    type Promised = {
      /**
       * 当前storage中所有的key
       */
      keys: string[]
      /**
       * 当前占用的空间大小, 单位kb
       */
      currentSize: number
      /**
       * 限制的空间大小，单位kb
       */
      limitSize: number
    }
    type Param = {}
  }
  /**
   * 异步获取当前storage的相关信息
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getStorageInfo({
     success: function(res) {
       console.log(res.keys)
       console.log(res.currentSize)
       console.log(res.limitSize)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageInfo.html
   */
  function getStorageInfo(OBJECT?: getStorageInfo.Param): Promise<getStorageInfo.Promised>

  namespace getStorage {
    type Promised = {
      /**
       * key对应的内容
       */
      data: string
    }
    type Param = {
      /**
       * 本地缓存中的指定的 key
       */
      key: string
    }
  }
  /**
   * 从本地缓存中异步获取指定 key 对应的内容。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getStorage({
     key: 'key',
     success: function(res) {
         console.log(res.data)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorage.html
   */
  function getStorage(OBJECT: getStorage.Param): Promise<getStorage.Promised>

  /**
   * 同步清理本地数据缓存
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 本地数据存储的大小限制为 10MB
   *
   * **示例代码：**
   *
   ```javascript
   try {
       Taro.clearStorageSync()
   } catch(e) {
     // Do something when catch error
   }
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.clearStorageSync.html
   */
  function clearStorageSync(): void

  /**
   * 清理本地数据缓存。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.clearStorage()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.clearStorage.html
   */
  function clearStorage(): void
}
