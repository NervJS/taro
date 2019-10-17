declare namespace Taro {
  namespace saveImageToPhotosAlbum {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径
       */
      filePath: string
    }
  }
  /**
   * @since 1.2.0
   *
   * 保存图片到系统相册。需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.writePhotosAlbum
   *
   * **示例代码：**
   *
   ```javascript
   Taro.saveImageToPhotosAlbum({
       success(res) {
       }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html
   */
  function saveImageToPhotosAlbum(OBJECT: saveImageToPhotosAlbum.Param): Promise<saveImageToPhotosAlbum.Promised>

  namespace previewImage {
    type Param = {
      /**
       * 当前显示图片的链接，不填则默认为 urls 的第一张
       */
      current?: string
      /**
       * 需要预览的图片链接列表
       */
      urls: string[]
    }
  }
  /**
   * 预览图片。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.previewImage({
     current: '', // 当前显示图片的http链接
     urls: [] // 需要预览的图片http链接列表
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.previewImage.html
   */
  function previewImage(OBJECT: previewImage.Param): Promise<any>

  namespace getImageInfo {
    type Promised = {
      /**
       * 图片宽度，单位px
       */
      width: number
      /**
       * 图片高度，单位px
       */
      height: number
      /**
       * 返回图片的本地路径
       */
      path: string
      /**
       * 返回图片的方向，有效值见下表
       *
       * **orientation参数说明：**
       *
       *   枚举值           |  说明
       * -------------------|-----------------
       *   up               |  默认
       *   down             |  180度旋转
       *   left             |  逆时针旋转90度
       *   right            |  顺时针旋转90度
       *   up-mirrored      |  同up，但水平翻转
       *   down-mirrored    |  同down，但水平翻转
       *   left-mirrored    |  同left，但垂直翻转
       *   right-mirrored   |  同right，但垂直翻转
       *
       * @since 1.9.90
       */
      orientation: 'up' | 'down' | 'left' | 'right' | 'up-mirrored' | 'down-mirrored ' | 'left-mirrored' | 'right-mirrored'
      /**
       * 返回图片的格式
       *
       * @since 1.9.90
       */
      type: string
    }
    type Param = {
      /**
       * 图片的路径，可以是相对路径，临时文件路径，存储文件路径，网络图片路径
       */
      src: string
    }
  }
  /**
   * 获取图片信息
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getImageInfo({
     src: 'images/a.jpg',
     success: function (res) {
       console.log(res.width)
       console.log(res.height)
     }
   })
         Taro.chooseImage({
     success: function (res) {
       Taro.getImageInfo({
         src: res.tempFilePaths[0],
         success: function (res) {
           console.log(res.width)
           console.log(res.height)
         }
       })
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.getImageInfo.html
   */
  function getImageInfo(OBJECT: getImageInfo.Param): Promise<getImageInfo.Promised>

  namespace chooseImage {
    type Promised = {
      /**
       * 图片的本地文件路径列表
       */
      tempFilePaths: string[]
      /**
       * 图片的本地文件列表，每一项是一个 File 对象
       *
       * @since 1.2.0
       */
      tempFiles: PromisedPropTempFiles
    }
    /**
     * 图片的本地文件列表，每一项是一个 File 对象
     */
    type PromisedPropTempFiles = PromisedPropTempFilesItem[]
    type PromisedPropTempFilesItem = {
      /**
       * 本地文件路径
       */
      path: string
      /**
       * 本地文件大小，单位：B
       */
      size: number
    }
    type ParamPropTempFiles = ParamPropTempFilesItem[]
    type ParamPropTempFilesItem = {
      path: string
      size: number
    }
    type ParamPropSuccess = (res: { tempFilePaths: string[]; tempFiles: ParamPropTempFiles }) => void
    type ParamPropFail = (err: any) => void
    type ParamPropComplete = () => any
    type Param = {
      /**
       * 最多可以选择的图片张数，默认9
       */
      count?: number
      /**
       * original 原图，compressed 压缩图，默认二者都有
       */
      sizeType?: string[]
      /**
       * album 从相册选图，camera 使用相机，默认二者都有
       */
      sourceType?: string[]
      /**
       * success 回调
       */
      success?: ParamPropSuccess
      fail?: ParamPropFail
      complete?: ParamPropComplete
    }
  }
  /**
   * 从本地相册选择图片或使用相机拍照。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.chooseImage({
     count: 1, // 默认9
     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
     success: function (res) {
       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
       var tempFilePaths = res.tempFilePaths
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseImage.html
   */
  function chooseImage(OBJECT?: chooseImage.Param): Promise<chooseImage.Promised>

  // TODO: wx.compressImage
  // TODO: wx.chooseMessageFile
}
