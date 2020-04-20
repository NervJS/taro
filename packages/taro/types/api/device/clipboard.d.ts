declare namespace Taro {
  namespace setClipboardData {
    type Promised = {
      /**
       * 错误信息
       */
      errMsg: string
      /**
       * 剪贴板的内容
       */
      data: string
    }
    type Param = {
      /**
       * 需要设置的内容
       */
      data: string
    }
  }
  /**
   * @since 1.1.0
   *
   * 设置系统剪贴板的内容
   * 
   * **注意** 调用成功后，会弹出 toast 提示"内容已复制"，持续 1.5s
   *
   * **示例代码：**
   *
   ```javascript
   Taro.setClipboardData({
     data: 'data',
     success: function(res) {
       Taro.getClipboardData({
         success: function(res) {
           console.log(res.data) // data
         }
       })
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/clipboard/wx.setClipboardData.html
   */
  function setClipboardData(OBJECT: setClipboardData.Param): Promise<setClipboardData.Promised>

  namespace getClipboardData {
    type Promised = {
      /**
       * 错误信息
       */
      errMsg: string
      /**
       * 剪贴板的内容
       */
      data: string
    }
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 获取系统剪贴板内容
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getClipboardData({
     success: function(res){
       console.log(res.data)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/clipboard/wx.getClipboardData.html
   */
  function getClipboardData(OBJECT?: getClipboardData.Param): Promise<getClipboardData.Promised>
}
