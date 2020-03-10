declare namespace Taro {
  namespace loadFontFace {
    interface Option {
      /** 是否全局生效（最低版本2.10.0），默认false */
      global?: boolean,
      /** 定义的字体名称 */
      family: string
      /** 字体资源的地址。建议格式为 TTF 和 WOFF，WOFF2 在低版本的iOS上会不兼容。 */
      source: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: CompleteCallback
      /** 可选的字体描述符 */
      desc?: DescOption
      /** 接口调用失败的回调函数 */
      fail?: FailCallback
      /** 接口调用成功的回调函数 */
      success?: SuccessCallback
    }
    /** 可选的字体描述符 */
    interface DescOption {
      /** 字体样式，可选值为 normal / italic / oblique */
      style?: string
      /** 设置小型大写字母的字体显示文本，可选值为 normal / small-caps / inherit */
      variant?: string
      /** 字体粗细，可选值为 normal / bold / 100 / 200../ 900 */
      weight?: string
    }
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    type CompleteCallback = (
      result: CompleteCallbackResult,
    ) => void
    /** 接口调用失败的回调函数 */
    type FailCallback = (
        result: FailCallbackResult,
    ) => void
    /** 接口调用成功的回调函数 */
    type SuccessCallback = (
        result: SuccessCallbackResult,
    ) => void
    interface CompleteCallbackResult {
      /** 加载字体结果 */
      status: string
    }
    interface FailCallbackResult {
      /** 加载字体结果 */
      status: string
    }
    interface SuccessCallbackResult {
      /** 加载字体结果 */
      status: string
    }
  }
  /** 动态加载网络字体。文件地址需为下载类型。iOS 仅支持 https 格式文件地址。
   *
   * 注意：
   * 1. 字体文件返回的 contet-type 参考 [font](https://www.iana.org/assignments/media-types/media-types.xhtml#font)，格式不正确时会解析失败。
   * 2. 字体链接必须是https（ios不支持http)
   * 3. 字体链接必须是同源下的，或开启了cors支持，小程序的域名是`servicewechat.com`
   * 4. canvas等原生组件不支持使用接口添加的字体
   * 5. 工具里提示 Faild to load font可以忽略
   * @supported weapp
   * @example
   * ```tsx
   * Taro.loadFontFace({
   *   family: 'Bitstream Vera Serif Bold',
   *   source: 'url("https://sungd.github.io/Pacifico.ttf")',
   *   success: console.log
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/font/wx.loadFontFace.html
   */
  function loadFontFace(option: loadFontFace.Option): void
}
