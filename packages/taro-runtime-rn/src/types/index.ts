// 不直接引用taro/tarojs, type 定义直接copy taro.config.js，保持各端一致

interface CommonConfig {
  /**
   * 导航栏背景颜色，HexColor
   * default: #000000
   */
  navigationBarBackgroundColor?: string
  /**
   * 导航栏标题颜色，仅支持 black/white
   * default: 'white'
   */
  navigationBarTextStyle?: 'white' | 'black'
  /**
   * 导航栏标题文字内容
   */
  navigationBarTitleText?: string
  /**
   * 导航栏样式，仅支持以下值：
   * default 默认样式
   * custom 自定义导航栏
   */
  navigationStyle?: 'default' | 'custom'
  /**
   * 窗口的背景色， HexColor
   * default: #ffffff
   */
  backgroundColor?: string
  /**
   * 下拉背景字体、loading 图的样式，仅支持 dark/light
   * default: 'dark'
   */
  backgroundTextStyle?: 'dark' | 'light'
  /**
   * 顶部窗口的背景色，仅 iOS 支持
   * default: #ffffff
   */
  backgroundColorTop?: string
  /**
   * 底部窗口的背景色，仅 iOS 支持
   * default: #ffffff
   */
  backgroundColorBottom?: string
  /**
   * 是否开启下拉刷新
   * default: false
   */
  enablePullDownRefresh?: boolean
  /**
   * 页面上拉触底事件触发时距页面底部距离，单位为px
   * default: 50
   */
  onReachBottomDistance?: number
}

interface TarbarList {
  /**
   * 页面路径，必须在 pages 中先定义
   */
  pagePath: string
  /**
   * tab 上按钮文字
   */
  text: string
  /**
   * 图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效，不支持网络图片
   */
  iconPath?: string
  /**
   * 选中时的图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px ，当 postion 为 top 时，此参数无效
   */
  selectedIconPath?: string
}

interface TabBar {
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
   * @default: black
   */
  borderStyle?: 'black' | 'white'
  /**
   * tabar 的位置，可选值 bottom、top
   * @default: 'bottom'
   */
  position?: 'bottom' | 'top'
  /**
   * 自定义 tabBar，见[详情](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html)
   * @default false
   * @since 2.1.0
   */
  custom?: boolean

  list: TarbarList[]
}

interface SubPackage {
  /**
   * 分包根路径
   * - 注意：不能放在主包pages目录下
   */
  root: string
  /**
   * 分包路径下的所有页面配置
   */
  pages: string[]
}

interface PageItem {
  name: string,
  component: any,
  pagePath: string
}
export interface PageConfig extends CommonConfig {
  /**
   * 设置为 true 则页面整体不能上下滚动；
   * 只在页面配置中有效，无法在 app.json 中设置该项
   * default: false
   */
  disableScroll?: boolean
  pagePath: string,
  rn?: any
}

export interface WindowConfig extends CommonConfig {
  /**
   * 屏幕旋转设置
   * 支持 auto / portrait / landscape
   * default: portrait
   * 详见 [响应显示区域变化](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html)
   */
  pageOrientation?: 'auto' | 'portrait' | 'landscape'
  /**
   * 是否允许下拉刷新
   * default: NO
   * 备注：下拉刷新生效的前提是 allowsBounceVertical 值为 YES
   */
  pullRefresh?: 'YES' | 'NO' | boolean
  /**
   * 是否允许向下拉拽
   * default: YES
   */
  allowsBounceVertical?: 'YES' | 'NO'
}
export interface AppConfig {
  pages: string[],
  window?: WindowConfig,
  tabBar?: TabBar,
  subPackages?: SubPackage[]
  subpackages?: SubPackage[],
  designWidth: number,
  deviceRatio: Record<number, number>,
  linkPrefix: string[],
  rn?: any
}

export interface RNAppConfig {
  appConfig: AppConfig
  pageList: PageItem[]
}

export type HooksMethods = 'componentDidShow' | 'componentDidHide' | 'onPullDownRefresh' | 'onReachBottom' | 'onPageScroll' | 'onResize' | 'onTabItemTap'
