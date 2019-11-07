declare namespace Taro {
  namespace showTabBarRedDot {
    type Param = {
      /**
       * tabBar的哪一项，从左边算起
       */
      index: number
    }
  }
  /**
   * 显示 tabBar 某一项的右上角的红点
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.showTabBarRedDot.html
   */
  function showTabBarRedDot(res: showTabBarRedDot.Param): Promise<any>

  namespace showTabBar {
    type Param = {
      /**
       * 是否需要动画效果，默认无
       */
      animation?: boolean
    }
  }
  /**
   * 显示 tabBar
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.showTabBar.html
   */
  function showTabBar(res?: showTabBar.Param): Promise<any>

  namespace setTabBarStyle {
    type Param = {
      /**
       * tab 上的文字默认颜色
       */
      color?: string
      /**
       * tab 上的文字选中时的颜色
       */
      selectedColor?: string
      /**
       * tab 的背景色
       */
      backgroundColor?: string
      /**
       * tabbar上边框的颜色， 仅支持 black/white
       */
      borderStyle?: string
    }
  }
  /**
   * 动态设置 tabBar 的整体样式
   * @example
```tsx
Taro.setTabBarStyle({
    color: '#FF0000',
    selectedColor: '#00FF00',
    backgroundColor: '#0000FF',
    borderStyle: 'white'
})
```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarStyle.html
   */
  function setTabBarStyle(res?: setTabBarStyle.Param): Promise<any>

  namespace setTabBarItem {
    type Param = {
      /**
       * tabBar 的哪一项，从左边算起
       */
      index: number
      /**
       * tab 上按钮文字
       */
      text?: string
      /**
       * 图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效，不支持网络图片
       */
      iconPath?: string
      /**
       * 选中时的图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px ，当 postion 为 top 时，此参数无效
       */
      selectedIconPath?: string
    }
  }
  /**
   * 动态设置 tabBar 某一项的内容
   * @example
```tsx
Taro.setTabBarItem({
    index: 0,
    text: 'text',
    iconPath: '/path/to/iconPath',
    selectedIconPath: '/path/to/selectedIconPath'
})
```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarItem.html
   */
  function setTabBarItem(res: setTabBarItem.Param): Promise<any>

  namespace setTabBarBadge {
    type Param = {
      /**
       * tabBar的哪一项，从左边算起
       */
      index: number
      /**
       * 显示的文本，超过 3 个字符则显示成“…”
       */
      text: string
    }
  }
  /**
   * 为 tabBar 某一项的右上角添加文本
   * @example
```tsx
Taro.setTabBarBadge({
  index: 0,
  text: '1'
})
```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarBadge.html
   */
  function setTabBarBadge(res: setTabBarBadge.Param): Promise<any>

  namespace removeTabBarBadge {
    type Param = {
      /**
       * tabBar的哪一项，从左边算起
       */
      index: number
    }
  }
  /**
   * 移除 tabBar 某一项右上角的文本
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.removeTabBarBadge.html
   */
  function removeTabBarBadge(res: removeTabBarBadge.Param): Promise<any>

  namespace hideTabBarRedDot {
    type Param = {
      /**
       * tabBar的哪一项，从左边算起
       */
      index: number
    }
  }
  /**
   * 隐藏 tabBar 某一项的右上角的红点
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.hideTabBarRedDot.html
   */
  function hideTabBarRedDot(res: hideTabBarRedDot.Param): Promise<any>

  namespace hideTabBar {
    type Param = {
      /**
       * 是否需要动画效果，默认无
       */
      animation?: boolean
    }
  }
  /**
   * 隐藏 tabBar
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.hideTabBar.html
   */
  function hideTabBar(res?: hideTabBar.Param): Promise<any>
}
