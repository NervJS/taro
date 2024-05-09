import Taro from '../../index'

declare module '../../index' {
  namespace saveImageToPhotosAlbum {
    interface Option {
      /** 图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径 */
      filePath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace previewImage {
    interface Option {
      /** 需要预览的图片链接列表。 */
      urls: string[]
      /**
       * 微信端为当前显示图片的链接，支付宝端为当前显示图片的索引值
       */
      current?: string | number
      /**
       * 是否支持长按下载图片
       * @supported alipay 基础库: 1.13.0
       */
      enablesavephoto?: boolean
      /**
       * 是否在右下角显示下载入口
       * @supported alipay 基础库: 1.13.0
       */
      enableShowPhotoDownload?: boolean
      /** @supported weapp 最低版本：2.13.0。是否显示长按菜单，默认值：true */
      showmenu?: boolean
      /** @supported weapp 最低版本：2.13.0。origin: 发送完整的referrer; no-referrer: 不发送。格式固定为 https://servicewechat.com/{appid}/{version}/page-frame.html，其中 {appid} 为小程序的 appid，{version} 为小程序的版本号，版本号为 0 表示为开发版、体验版以及审核版本，版本号为 devtools 表示为开发者工具，其余为正式版本；默认值：no-referrer */
      referrerPolicy?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace previewMedia {
    interface Sources {
      /** 图片或视频的地址 */
      url: string
      /** 资源的类型（图片或视频），默认值：image */
      type?: 'image' | 'video'
      /** 视频的封面图片 */
      poster?: string
    }
    interface Option {
      /** 需要预览的资源列表 */
      sources: Sources[]
      /** 当前显示的资源序号，默认值：0 */
      current?: number
      /** 是否显示长按菜单	2.13.0，默认值：true */
      showmenu?: boolean
      /** origin: 发送完整的referrer; no-referrer: 不发送。格式固定为 https://servicewechat.com/{appid}/{version}/page-frame.html，其中 {appid} 为小程序的 appid，{version} 为小程序的版本号，版本号为 0 表示为开发版、体验版以及审核版本，版本号为 devtools 表示为开发者工具，其余为正式版本；默认值：no-referrer */
      referrerPolicy?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace getImageInfo {
    interface Option {
      /** 图片的路径，可以是相对路径、临时文件路径、存储文件路径、网络图片路径 */
      src: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 图片原始高度，单位px。不考虑旋转。 */
      height: number
      /** [拍照时设备方向](http://sylvana.net/jpegcrop/exif_orientation.html)
       * @default "up"
       */
      orientation: keyof Orientation
      /** 图片的本地路径 */
      path: string
      /** 图片格式 */
      type: string
      /** 图片原始宽度，单位px。不考虑旋转。 */
      width: number
      /** 调用结果 */
      errMsg: string
    }

    interface Orientation {
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

  namespace editImage {
    interface Option {
      /** 图片路径，图片的路径，支持本地路径、代码包路径 */
      src: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 编辑后图片的临时文件路径 (本地路径) */
      tempFilePath: string
    }
  }

  namespace chooseImage {
    interface Option {
      /** 最多可以选择的图片张数
       * @default 9
       * @supported weapp, alipay, swan, tt, h5, rn
       */
      count?: number
      /** 所选的图片的尺寸
       * @default ['original', 'compressed']
       * @supported weapp, alipay, swan, tt, rn
       */
      sizeType?: Array<keyof sizeType>
      /** 选择图片的来源
       * @default ['album', 'camera']
       * @supported weapp, alipay, swan, tt, h5, rn
       */
      sourceType?: Array<keyof sourceType>
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 用来上传的input元素ID（仅h5端
       * @supported h5
       */
      imageId?: string
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
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
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

  namespace compressImage {
    interface Option {
      /** 图片路径，图片的路径，可以是相对路径、临时文件路径、存储文件路径 */
      src: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 压缩质量，范围0～100，数值越小，质量越低，压缩率越高（仅对jpg有效）。 */
      quality?: number
      /** 压缩后图片的宽度，单位为px，若不填写则默认以 compressedHeight 为准等比缩放。 */
      compressedWidth?: number
      /** 压缩后图片的高度，单位为px，若不填写则默认以 compressedWidth 为准等比缩放。 */
      compressHeight?: number
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 压缩后图片的临时文件路径 */
      tempFilePath: string
      /** 调用结果 */
      errMsg: string
    }
  }

  namespace chooseMessageFile {
    interface Option {
      /** 最多可以选择的文件个数，可以 0～100 */
      count: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 根据文件拓展名过滤，仅 type==file 时有效。每一项都不能是空字符串。默认不过滤。 */
      extension?: string[]
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 所选的文件的类型  */
      type?: keyof SelectType
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
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
      type: keyof SelectedType
    }
    interface SelectType {
      /** 从所有文件选择 */
      all
      /** 只能选择视频文件 */
      video
      /** 只能选择图片文件 */
      image
      /** 可以选择除了图片和视频之外的其它的文件 */
      file
    }
    interface SelectedType {
      /** 选择了视频文件 */
      video
      /** 选择了图片文件 */
      image
      /** 选择了除图片和视频的文件 */
      file
    }
  }

  namespace cropImage {
    interface Option {
      /** 图片路径，图片的路径，支持本地路径、代码包路径 */
      src: string
      /** 裁剪比例 */
      cropScale: keyof CropScale
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 剪裁后图片的临时文件路径 (本地路径) */
      tempFilePath: string
    }
    interface CropScale {
      /** 宽高比为1比1 */
      '1:1'
      /** 宽高比为3比4 */
      '3:4'
      /** 宽高比为4比3 */
      '4:3'
      /** 宽高比为4比5 */
      '4:5'
      /** 宽高比为5比4 */
      '5:4'
      /** 宽高比为9比16 */
      '9:16'
      /** 宽高比为16比9 */
      '16:9'
    }
  }

  interface TaroStatic {
    /** 保存图片到系统相册。需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.writePhotosAlbum
     * @supported weapp, alipay, swan, tt, h5, rn, harmony_hybrid
     * @example
     * ```tsx
     * Taro.saveImageToPhotosAlbum({
     *   success: function (res) { }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html
     */
    saveImageToPhotosAlbum(option: saveImageToPhotosAlbum.Option): Promise<TaroGeneral.CallbackResult>

    /** 预览图片和视频。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.previewMedia({
     *   sources: []
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.previewMedia.html
     */
    previewMedia(option: previewMedia.Option): Promise<TaroGeneral.CallbackResult>

    /** 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
     * @supported weapp, alipay, swan, tt, h5, rn, harmony_hybrid
     * @example
     * ```tsx
     * Taro.previewImage({
     *   current: '', // 当前显示图片的http链接
     *   urls: [] // 需要预览的图片http链接列表
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.previewImage.html
     */
    previewImage(option: previewImage.Option): Promise<TaroGeneral.CallbackResult>

    /** 获取图片信息。网络图片需先配置download域名才能生效。
     * @supported weapp, alipay, swan, tt, h5, rn, harmony_hybrid
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
    getImageInfo(option: getImageInfo.Option): Promise<getImageInfo.SuccessCallbackResult>

    /** 编辑图片接口
     * @supported weapp
     * @example
     * ```tsx
     * Taro.editImage({
     *   src: '', // 图片路径
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.editImage.html
     */
    editImage(option: editImage.Option): Promise<editImage.SuccessCallbackResult>

    /** 压缩图片接口，可选压缩质量
     * @supported weapp, tt, rn
     * @example
     * ```tsx
     * Taro.compressImage({
     *   src: '', // 图片路径
     *   quality: 80 // 压缩质量
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.compressImage.html
     */
    compressImage(option: compressImage.Option): Promise<compressImage.SuccessCallbackResult>

    /** 从客户端会话选择文件。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.chooseMessageFile({
     *   count: 10,
     *   type: 'image',
     *   success: function (res) {
     *     // tempFilePath可以作为img标签的src属性显示图片
     *     const tempFilePaths = res.tempFiles
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseMessageFile.html
     */
    chooseMessageFile(option: chooseMessageFile.Option): Promise<chooseMessageFile.SuccessCallbackResult>

    /**
     * 从本地相册选择图片或使用相机拍照。
     * @supported weapp, alipay, swan, tt, h5, rn, harmony_hybrid
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
    chooseImage(option: chooseImage.Option): Promise<chooseImage.SuccessCallbackResult>

    /**
     * 裁剪图片接口
     * @supported weapp
     * @example
     * ```tsx
     * Taro.cropImage({
     *   src: '', // 图片路径
     *   cropScale: '1:1', // 裁剪比例
     *   success: function (res) {
     *     // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
     *     var tempFilePaths = res.tempFilePaths
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.cropImage.html
     */
    cropImage(option: cropImage.Option): Promise<cropImage.SuccessCallbackResult>
  }
}
