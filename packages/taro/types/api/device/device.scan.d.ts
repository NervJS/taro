declare namespace Taro {
  namespace scanCode {
    type Promised = {
      /**
       * 所扫码的内容
       */
      result: any
      /**
       * 所扫码的类型
       */
      scanType: any
      /**
       * 所扫码的字符集
       */
      charSet: any
      /**
       * 当所扫的码为当前小程序的合法二维码时，会返回此字段，内容为二维码携带的 path
       */
      path: any
    }
    type Param = {
      /**
       * 是否只能从相机扫码，不允许从相册选择图片
       *
       * @since 1.2.0
       */
      onlyFromCamera?: boolean
      /**
       * 扫码类型，参数类型是数组，二维码是'qrCode'，一维码是'barCode'，DataMatrix是‘datamatrix’，pdf417是‘pdf417’。
       *
       * @since 1.7.0
       */
      scanType?: any[]
    }
  }
  /**
   * 调起客户端扫码界面，扫码成功后返回对应的结果
   *
   * **示例代码：**
   *
   ```javascript
   // 允许从相机和相册扫码
   Taro.scanCode({
     success: (res) => {
       console.log(res)
     }
   })
         // 只允许从相机扫码
   Taro.scanCode({
     onlyFromCamera: true,
     success: (res) => {
       console.log(res)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/scan/wx.scanCode.html
   */
  function scanCode(OBJECT?: scanCode.Param): Promise<scanCode.Promised>
}
