declare namespace Taro {
  /**
   * 微信小程序全局 Window 配置和页面配置的公共项目
   */
  interface CommonPageConfig {
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

  interface PageConfig extends CommonPageConfig {
    /**
     * 设置为 true 则页面整体不能上下滚动；
     * 只在页面配置中有效，无法在 app.json 中设置该项
     * default: false
     */
    disableScroll?: boolean
    /**
     * 禁止页面右滑手势返回
     * default: false
     *
     * **注意** 自微信客户端 7.0.5 开始，页面配置中的 disableSwipeBack 属性将不再生效，
     * 详情见[右滑手势返回能力调整](https://developers.weixin.qq.com/community/develop/doc/000868190489286620a8b27f156c01)公告
     * @since 微信客户端 7.0.0
     */
    disableSwipeBack?: boolean
  }

  interface WindowConfig extends CommonPageConfig {
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
    allowsBounceVertical?:  'YES' | 'NO'
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

  interface NetworkTimeout {
    /**
     * wx.request 的超时时间，单位毫秒。
     * @default 60000
     */
    request?: number
    /**
     * wx.connectSocket 的超时时间，单位毫秒。
     * @default 60000
     */
    connectSocket?: number
    /**
     * wx.uploadFile 的超时时间，单位毫秒。
     * @default 60000
     */
    uploadFile?: number
    /**
     * wx.downloadFile 的超时时间，单位毫秒。
     * @default 60000
     */
    downloadFile?: number
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
    /**
     * 分包别名，分包预下载时可以使用
     */
    name?: string
    /**
     * 分包是否是独立分包
     */
    independent?: boolean
  }

  interface Plugins {
    [key: string]: {
      version: string
      provider: string
    }
  }

  interface PreloadRule {
    [key: string]: {
      /**
       *进入页面后预下载分包的 root 或 name。__APP__ 表示主包。
       */
      packages: string[]
      /**
       * 在指定网络下预下载，可选值为：
       * all: 不限网络
       * wifi: 仅wifi下预下载
       * @default wifi
       */
      network?: 'all' | 'wifi'
    }
  }

  interface Permission {
    [key: string]: {
      /**
       * 小程序获取权限时展示的接口用途说明。最长30个字符
       */
      desc: string
    }
  }

  interface AppConfig {
    /**
     * 接受一个数组，每一项都是字符串，来指定小程序由哪些页面组成，数组的第一项代表小程序的初始页面
     */
    pages?: string[]
    tabBar?: TabBar
    /**
     * 各类网络请求的超时时间，单位均为毫秒。
     */
    networkTimeout?: NetworkTimeout
    /**
     * 是否开启 debug 模式，默认关闭
     * @default false
     */
    debug?: boolean
    /**
     * 启用插件功能页时，插件所有者小程序需要设置其 functionalPages 为 true。
     * @see https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages.html
     * @default false
     * @since 2.1.0
     */
    functionalPages?: boolean
    /**
     * 分包加载配置
     * 示例:
     * [
     *   {
     *     root: 'packages/module',
     *     pages: [
     *       'pages/page/index'
     *     ]
     *   }
     * ]
     * @since 1.7.3
     */
    subPackages?: SubPackage[]
    /**
     * Worker 代码放置的目录
     * 使用 Worker 处理多线程任务时，设置 Worker 代码放置的目录
     * @since 1.9.90
     */
    workers?: string
    /**
     * 申明需要后台运行的能力，类型为数组。目前支持以下项目：
     * @since 微信客户端 6.7.2 及以上版本支持
     */
    requiredBackgroundModes?: ['audio']
    /**
     * 使用到的插件
     * @since 1.9.6
     */
    plugins?: Plugins
    /**
     * 声明分包预下载的规则。
     * preloadRule 中，key 是页面路径，value 是进入此页面的预下载配置
     * 注意: 分包预下载目前只支持通过配置方式使用，暂不支持通过调用API完成。
     *      vConsole 里有preloadSubpackages开头的日志信息，可以用来验证预下载的情况。
     * @since 2.3.0
     */
    preloadRule?: PreloadRule
    /**
     * iPad 小程序是否支持屏幕旋转
     * @default false
     * @since 2.3.0
     */
    resizable?: boolean
    /**
     * 需要跳转的小程序列表
     * @since 2.4.0
     */
    navigateToMiniProgramAppIdList?: string[]
    /**
     * 小程序接口权限相关设置
     * @since 微信客户端 7.0.0
     */
    permission?: Permission
    /**
     * 指定使用升级后的weui样式
     * @since 2.8.0
     */
    style?: 'v2'
  }

  interface Config extends PageConfig, AppConfig {
    usingComponents?: {
      [key: string]: string
    }
    window?: WindowConfig
    cloud?: boolean
    pageOrientation?: 'auto' | 'portrait' | 'landscape'
  }
}
