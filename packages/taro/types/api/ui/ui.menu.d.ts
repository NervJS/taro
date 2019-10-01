declare namespace Taro {
  namespace getMenuButtonBoundingClientRect {
    type Return = {
      /**
       * 宽度，单位：px
       */
      width: number
      /**
       * 高度，单位：px
       */
      height: number
      /**
       * 	上边界坐标，单位：px
       */
      top: number
      /**
       * 	右边界坐标，单位：px
       */
      right: number
      /**
       * 	下边界坐标，单位：px
       */
      bottom: number
      /**
       * 	左边界坐标，单位：px
       */
      left: number
    }
  }
  /**
   * @since 2.1.0
   *
   * 获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/menu/wx.getMenuButtonBoundingClientRect.html
   */
  function getMenuButtonBoundingClientRect(): getMenuButtonBoundingClientRect.Return
}
