import Taro from '../../index'

declare module '../../index' {
  namespace loadFontFace {
    interface Option {
      /** 是否全局生效
       * @default false
       */
      global?: boolean,
      /** 定义的字体名称 */
      family: string
      /** 字体资源的地址。建议格式为 TTF 和 WOFF，WOFF2 在低版本的 iOS 上会不兼容。 */
      source: string
      /** 可选的字体描述符 */
      desc?: DescOption
      /** 接口调用成功的回调函数 */
      success?: (res: CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: CallbackResult) => void
    }

    interface CallbackResult extends TaroGeneral.CallbackResult {
      /** 加载字体结果 */
      status: string
    }
    /** 可选的字体描述符 */
    interface DescOption {
      /** @supported h5 */
      ascentOverride?: string
      /** @supported h5 */
      descentOverride?: string
      /** @supported h5 */
      featureSettings?: string
      /** @supported h5 */
      lineGapOverride?: string
      /** @supported h5 */
      stretch?: string
      /** 字体样式，可选值为 normal / italic / oblique */
      style?: string
      /** @supported h5 */
      unicodeRange?: string
      /** 设置小型大写字母的字体显示文本，可选值为 normal / small-caps / inherit */
      variant?: string
      /** @supported h5 */
      variationSettings?: string
      /** 字体粗细，可选值为 normal / bold / 100 / 200../ 900 */
      weight?: string
    }
  }

  interface TaroStatic {
    /** 动态加载网络字体。文件地址需为下载类型。iOS 仅支持 https 格式文件地址。
     *
     * 注意：
     * 1. 字体文件返回的 context-type 参考 [font](https://www.iana.org/assignments/media-types/media-types.xhtml#font)，格式不正确时会解析失败。
     * 2. 字体链接必须是https（ios不支持http)
     * 3. 字体链接必须是同源下的，或开启了cors支持，小程序的域名是`servicewechat.com`
     * 4. canvas等原生组件不支持使用接口添加的字体
     * 5. 工具里提示 Failed to load font 可以忽略
     * @supported weapp, alipay, h5
     * @h5 不支持 global (默认全局加载)
     * @alipay source 地址格式为 `url('https://...')`，而不是单纯 URL 地址
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
    loadFontFace(option: loadFontFace.Option): Promise<loadFontFace.CallbackResult>
  }
}
