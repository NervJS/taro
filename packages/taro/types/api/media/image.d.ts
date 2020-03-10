declare namespace Taro {
  namespace saveImageToPhotosAlbum {
    interface Option {
      /** 图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径 */
      filePath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /** 保存图片到系统相册。需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.writePhotosAlbum
   * @supported weapp, rn, alipay, swan
   * @example
   * ```tsx
   * Taro.saveImageToPhotosAlbum({
   *   success: function (res) { }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html
   */
  function saveImageToPhotosAlbum(option: saveImageToPhotosAlbum.Option): Promise<General.CallbackResult>

  namespace previewImage {
    interface Option {
      /** 需要预览的图片链接列表。 */
      urls: string[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 当前显示图片的链接 */
      current?: string
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /** 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
   * @supported weapp, h5, rn, alipay, swan
   * @example
   * ```tsx
   * Taro.previewImage({
   *   current: '', // 当前显示图片的http链接
   *   urls: [] // 需要预览的图片http链接列表
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.previewImage.html
   */
  function previewImage(option: previewImage.Option): Promise<General.CallbackResult>

  namespace getImageInfo {
    interface Option {
      /** 图片的路径，可以是相对路径、临时文件路径、存储文件路径、网络图片路径 */
      src: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 图片原始高度，单位px。不考虑旋转。 */
      height: number
      /** [拍照时设备方向](http://sylvana.net/jpegcrop/exif_orientation.html)
       * @default "up"
       */
      orientation: keyof orientation
      /** 图片的本地路径 */
      path: string
      /** 图片格式 */
      type: string
      /** 图片原始宽度，单位px。不考虑旋转。 */
      width: number
      /** 调用结果 */
      errMsg: string
    }

    interface orientation {
      /** 默认方向（手机横持拍照），对应 Exif 中的 1。或无 orientation 信息。 */
      'up'
      /** 同 up，但镜像翻转，对应 Exif 中的 2 */
      'up-mirrored'
      /** 旋转180度，对应 Exif 中的 3 */
      'down'
      /** 同 down，但镜像翻转，对应 Exif 中的 4 */
      'down-mirrored'
      /** 同 left，但镜像翻转，对应 Exif 中的 5 */
      'left-mirrored'
      /** 顺时针旋转90度，对应 Exif 中的 6 */
      'right'
      /** 同 right，但镜像翻转，对应 Exif 中的 7 */
      'right-mirrored'
      /** 逆时针旋转90度，对应 Exif 中的 8 */
      'left'
    }
  }
  /** 获取图片信息。网络图片需先配置download域名才能生效。
   * @supported weapp, h5, rn, alipay, swan
   * @example
   * ```tsx
   * Taro.getImageInfo({
   *   src: 'images/a.jpg',
   *   success: function (res) {
   *     console.log(res.width)
   *     console.log(res.height)
   *   }
   * })
   * Taro.chooseImage({
   *   success: function (res) {
   *     Taro.getImageInfo({
   *       src: res.tempFilePaths[0],
   *       success: function (res) {
   *         console.log(res.width)
   *         console.log(res.height)
   *       }
   *     })
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.getImageInfo.html
   */
  function getImageInfo(option: getImageInfo.Option): Promise<getImageInfo.SuccessCallbackResult>

  namespace chooseImage {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 最多可以选择的图片张数 */
      count?: number
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 所选的图片的尺寸 */
      sizeType?: Array<keyof sizeType>
      /** 选择图片的来源 */
      sourceType?: Array<keyof sourceType>
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    /** 图片的尺寸 */
    interface sizeType {
      /** 原图 */
      original
      /** compressed */
      compressed
    }
    /** 图片的来源 */
    interface sourceType {
      /** 从相册选图 */
      album
      /** 使用相机 */
      camera
      /** 使用前置摄像头(仅H5纯浏览器使用) */
      user
      /** 使用后置摄像头(仅H5纯浏览器) */
      environment
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 图片的本地临时文件路径列表 */
      tempFilePaths: string[]
      /** 图片的本地临时文件列表 */
      tempFiles: ImageFile[]
      /** 调用结果 */
      errMsg: string
    }
    /** 图片的本地临时文件列表 */
    interface ImageFile {
      /** 本地临时文件路径 */
      path: string
      /** 本地临时文件大小，单位 B */
      size: number
      /** 文件的 MIME 类型
       * @supported h5
       */
      type?: string
      /** 原始的浏览器 File 对象
       * @supported h5
       */
      originalFileObj?: File
    }
  }
  /**
   * 从本地相册选择图片或使用相机拍照。
   * @supported weapp, h5, rn, alipay, swan
   * @example
   * ```tsx
   * Taro.chooseImage({
   *   count: 1, // 默认9
   *   sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
   *   sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
   *   success: function (res) {
   *     // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
   *     var tempFilePaths = res.tempFilePaths
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseImage.html
   */
  function chooseImage(option: chooseImage.Option): Promise<chooseImage.SuccessCallbackResult>

  namespace compressImage {
    interface Option {
      /** 图片路径，图片的路径，可以是相对路径、临时文件路径、存储文件路径 */
      src: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 压缩质量，范围0～100，数值越小，质量越低，压缩率越高（仅对jpg有效）。 */
      quality?: number
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 压缩后图片的临时文件路径 */
      tempFilePath: string
      /** 调用结果 */
      errMsg: string
    }
  }

  /** 压缩图片接口，可选压缩质量
   * @supported weapp
   * @example
   * ```tsx
   * Taro.compressImage({
   *   src: '', // 图片路径
   *   quality: 80 // 压缩质量
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.compressImage.html
   */
  function compressImage(option: compressImage.Option): Promise<compressImage.SuccessCallbackResult>

  namespace chooseMessageFile {
    interface Option {
      /** 最多可以选择的文件个数，可以 0～100 */
      count: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 根据文件拓展名过滤，仅 type==file 时有效。每一项都不能是空字符串。默认不过滤。 */
      extension?: string[]
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 所选的文件的类型  */
      type?: keyof selectType
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 返回选择的文件的本地临时文件对象数组 */
      tempFiles: ChooseFile[]
      /** 调用结果 */
      errMsg: string
    }
    /** 返回选择的文件的本地临时文件对象数组 */
    interface ChooseFile {
      /** 选择的文件名称 */
      name: string
      /** 本地临时文件路径 */
      path: string
      /** 本地临时文件大小，单位 B */
      size: number
      /** 选择的文件的会话发送时间，Unix时间戳，工具暂不支持此属性 */
      time: number
      /** 选择的文件类型  */
      type: keyof selectedType
    }
    interface selectType {
      /** 从所有文件选择 */
      all
      /** 只能选择视频文件 */
      video
      /** 只能选择图片文件 */
      image
      /** 可以选择除了图片和视频之外的其它的文件 */
      file
    }
    interface selectedType {
      /** 选择了视频文件 */
      video
      /** 选择了图片文件 */
      image
      /** 选择了除图片和视频的文件 */
      file
    }
  }
  /** 从客户端会话选择文件。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.chooseMessageFile({
   *   count: 10,
   *   type: 'image',
   *   success: function (res) {
   *     // tempFilePath可以作为img标签的src属性显示图片
   *     const tempFilePaths = res.tempFilePaths
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseMessageFile.html
   */
  function chooseMessageFile(option: chooseMessageFile.Option): Promise<compressImage.SuccessCallbackResult>
}
