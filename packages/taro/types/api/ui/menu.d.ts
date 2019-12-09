declare namespace Taro {
  namespace getMenuButtonBoundingClientRect {
    /** 菜单按钮的布局位置信息 */
    interface Rect {
      /** 下边界坐标，单位：px */
      bottom: number
      /** 高度，单位：px */
      height: number
      /** 左边界坐标，单位：px */
      left: number
      /** 右边界坐标，单位：px */
      right: number
      /** 上边界坐标，单位：px */
      top: number
      /** 宽度，单位：px */
      width: number
    }
  }

  /** 获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/menu/wx.getMenuButtonBoundingClientRect.html
   */
  function getMenuButtonBoundingClientRect(): getMenuButtonBoundingClientRect.Rect
}
