declare namespace Taro {
  /** 注册小程序中的一个页面。接受一个 `Object` 类型参数，其指定页面的初始数据、生命周期回调、事件处理函数等。 */
  interface Page {
    /**
     * 当前页面的路径
     */
    route: string
    /** @ignore */
    [k: string]: any
  }
  /** 获取当前页面栈。数组中第一个元素为首页，最后一个元素为当前页面。
   * __注意：__
   * - __不要尝试修改页面栈，会导致路由以及页面状态错误。__
   * - 不要在 `App.onLaunch` 的时候调用 `getCurrentPages()`，此时 `page` 还没有生成。
   * @supported weapp, h5
   * @example
   * ```tsx
   * Taro.getCurrentPages().length
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/reference/api/getCurrentPages.html
   */
  function getCurrentPages(): Page[]

  /** 获取到小程序全局唯一的 App 实例。
   * @supported weapp, alipay, h5, rn, jd, qq, swan, tt, quickapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/reference/api/getApp.html
   */
  function getApp<T = General.IAnyObject>(opts?: getApp.Option): getApp.Instance<T>

  namespace getApp {
    interface Option {
      /** 在 `App` 未定义时返回默认实现。当App被调用时，默认实现中定义的属性会被覆盖合并到App中。一般用于独立分包 */
      allowDefault?: boolean
    }
    type Instance<T extends App> = Option & T
  }

  /** 注册小程序。接受一个 `Object` 参数，其指定小程序的生命周期回调等。
   * @ignore
   */
  interface App extends General.IAnyObject {
    /** @ignore */
    [key: string]: any
  }
}
