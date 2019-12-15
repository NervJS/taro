declare namespace Taro {
  /** `EditorContext` 实例，可通过 `Taro.createSelectorQuery` 获取。
   * `EditorContext` 通过 `id` 跟一个 `editor` 组件绑定，操作对应的 `editor` 组件。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.html
   */
  interface EditorContext {
    /** 编辑器失焦，同时收起键盘。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.blur.html
     */
    blur(option?: EditorContext.BlurOption): void
    /** 清空编辑器内容
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.clear.html
     */
    clear(option?: EditorContext.ClearOption): void
    /** 修改样式
     *
     * ****
     *
     * ## 支持设置的样式列表
     * | name | value |
     * | ------| ------ |
     * | bold  |        |
     * | italic  |        |
     * | underline  |        |
     * | strike  |        |
     * | ins  |        |
     * | script  | sub / super |
     * | header  | H1 / H2 / h3 / H4 / h5 /  H6 |
     * | align  | left / center / right / justify |
     * | direction  | rtl  |
     * | indent | -1 / +1 |
     * | list | ordered / bullet / check |
     * | color | hex color |
     * | backgroundColor| hex color |
     * | margin/marginTop/marginBottom/marginLeft/marginRight  |  css style  |
     * | padding/paddingTop/paddingBottom/paddingLeft/paddingRight  | css style |
     * | font/fontSize/fontStyle/fontVariant/fontWeight/fontFamily  |  css style |
     * | lineHeight | css style |
     * | letterSpacing |  css style |
     * | textDecoration |  css style |
     * | textIndent    | css style |
     *
     * 对已经应用样式的选区设置会取消样式。css style 表示 css 中规定的允许值。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.format.html
     */
    format(
      /** 属性 */
      name: string,
      /** 值 */
      value?: string,
    ): void
    /** 获取编辑器内容
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.getContents.html
     */
    getContents(option?: EditorContext.GetContentsOption): void
    /** 插入分割线
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.insertDivider.html
     */
    insertDivider(option?: EditorContext.InsertDividerOption): void
    /** 插入图片。
     *
     * 地址为临时文件时，获取的编辑器html格式内容中 <img> 标签增加属性 data-local，delta 格式内容中图片 attributes 属性增加 data-local 字段，该值为传入的临时文件地址。
     *
     * 开发者可选择在提交阶段上传图片到服务器，获取到网络地址后进行替换。替换时对于html内容应替换掉 <img> 的 src 值，对于 delta 内容应替换掉 `insert { image: abc }` 值。
     * @supported weapp
     * @example
     * ```tsx
     * this.editorCtx.insertImage({
     *   src: 'xx',
     *   width: '100px',
     *   height: '50px',
     *   extClass: className
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.insertImage.html
     */
    insertImage(option: EditorContext.InsertImageOption): void
    /** 覆盖当前选区，设置一段文本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.insertText.html
     */
    insertText(option: EditorContext.InsertTextOption): void
    /** 恢复
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.redo.html
     */
    redo(option?: EditorContext.RedoOption): void
    /** 清除当前选区的样式
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.removeFormat.html
     */
    removeFormat(option?: EditorContext.RemoveFormatOption): void
    /** 使得编辑器光标处滚动到窗口可视区域内。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.scrollIntoView.html
     */
    scrollIntoView(): void
    /** 初始化编辑器内容，html和delta同时存在时仅delta生效
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.setContents.html
     */
    setContents(option: EditorContext.SetContentsOption): void
    /** 撤销
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.undo.html
     */
    undo(option?: EditorContext.UndoOption): void
  }

  namespace EditorContext {
    interface BlurOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface ClearOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface GetContentsOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface InsertDividerOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface InsertImageOption {
      /** 图片地址，仅支持 http(s)、base64、云图片(2.8.0)、临时文件(2.8.3)。 */
      src: string
      /** 图像无法显示时的替代文本 */
      alt?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** data 被序列化为 name=value;name1=value2 的格式挂在属性 data-custom 上 */
      data?: General.IAnyObject
      /** 添加到图片 img 标签上的类名 */
      extClass?: string
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 图片高度 (pixels/百分比) */
      height?: string
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
      /** 图片宽度（pixels/百分比) */
      width?: string
    }
    interface InsertTextOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
      /** 文本内容 */
      text?: string
    }
    interface RedoOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface RemoveFormatOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface SetContentsOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 表示内容的delta对象 */
      delta?: General.IAnyObject
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 带标签的HTML内容 */
      html?: string
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface UndoOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
}
