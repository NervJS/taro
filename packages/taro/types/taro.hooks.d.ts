/// <reference path="taro.lifecycle.d.ts" />
/// <reference path="taro.component.d.ts" />

declare namespace Taro {
  /**
   * 页面展示时的回调
   */
  function useDidShow(callback: () => any): void
  /**
   * 页面隐藏时的回调
   */
  function useDidHide(callback: () => any): void
  /**
   * 监听用户下拉刷新事件
   */
  function usePullDownRefresh(callback: () => any): void
  /**
   * 监听用户上拉触底事件
   */
  function useReachBottom(callback: () => any): void
  /**
   * 监听用户滑动页面事件
   */
  function usePageScroll(callback: (obj: PageScrollObject) => any): void
  /**
   * 小程序屏幕旋转时触发
   */
  function useResize(callback: (obj: any) => any): void
  /**
   * 监听用户点击页面内转发按钮（button 组件 open-type="share"）或右上角菜单“转发”按钮的行为，并自定义转发内容
   */
  function useShareAppMessage(callback: (obj: ShareAppMessageObject) => any): void
  /**
   * 点击 tab 时触发
   */
  function useTabItemTap(callback: (obj: TabItemTapObject) => any): void
  /**
   * 获取页面传入路由相关参数
   */
  function useRouter(): RouterInfo
}
