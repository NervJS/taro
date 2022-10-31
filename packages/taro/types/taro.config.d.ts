import Taro from './index'

declare module './index' {
  /**
   * 微信小程序全局 Window 配置和页面配置的公共项目
   */
  interface CommonConfig {
    /** 导航栏背景颜色，HexColor
     * @default: "#000000"
     */
    navigationBarBackgroundColor?: string
    /** 导航栏标题颜色，仅支持 black/white
     * @default: "white"
     */
    navigationBarTextStyle?: 'white' | 'black'
    /** 导航栏标题文字内容 */
    navigationBarTitleText?: string
    /** 导航栏样式，仅支持以下值：
     * - default 默认样式
     * - custom 自定义导航栏
     */
    navigationStyle?: 'default' | 'custom'
    /** 窗口的背景色， HexColor
     * @default: "#ffffff"
     */
    backgroundColor?: string
    /** 下拉背景字体、loading 图的样式，仅支持 dark/light
     * @default: "dark"
     */
    backgroundTextStyle?: 'dark' | 'light'
    /** 顶部窗口的背景色，仅 iOS 支持
     * @default: "#ffffff"
     */
    backgroundColorTop?: string
    /** 底部窗口的背景色，仅 iOS 支持
     * @default: "#ffffff"
     */
    backgroundColorBottom?: string
    /** 是否开启下拉刷新
     * @default: false
     */
    enablePullDownRefresh?: boolean
    /** 页面上拉触底事件触发时距页面底部距离，单位为 px
     * @default: 50
     */
    onReachBottomDistance?: number
    /** 屏幕旋转设置
     * @see https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html
     */
    pageOrientation?: 'auto' | 'portrait' | 'landscape'
    /** 页面初始渲染缓存配置，支持 static / dynamic */
    initialRenderingCache?: 'static' | 'dynamic'
    /** 重新启动策略配置
     * - homePage: 如果从这个页面退出小程序，下次将从首页冷启动
     * - homePageAndLatestPage: 如果从这个页面退出小程序，下次冷启动后立刻加载这个页面，页面的参数保持不变（不可用于 tab 页）
     * @default "homePage"
     */
    restartStrategy?: 'homePage' | 'homePageAndLatestPage'
  }

  interface PageConfig extends CommonConfig {
    /** 设置为 true 则页面整体不能上下滚动；
     * 只在页面配置中有效，无法在 app.json 中设置该项
     * @default: false
     */
    disableScroll?: boolean
    /** 禁止页面右滑手势返回
     *
     * **注意** 自微信客户端 7.0.5 开始，页面配置中的 disableSwipeBack 属性将不再生效，
     * 详情见[右滑手势返回能力调整](https://developers.weixin.qq.com/community/develop/doc/000868190489286620a8b27f156c01)公告
     * @default: false
     * @since 微信客户端 7.0.0
     */
    disableSwipeBack?: boolean
    /** 是否启用分享给好友。
     * @default false
     */
    enableShareAppMessage?: boolean
    /** 是否启用分享到朋友圈。
     * @default false
     */
    enableShareTimeline?: boolean
    /** 页面自定义组件配置
     * @see https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
     */
    usingComponents?: Record<string, string>
    /** 指定使用升级后的 weui 样式
     * - v2: 可表明启用新版的组件样式
     * @default default
     */
    style?: string
    /** 单页模式相关配置 */
    singlePage?: SinglePage
  }

  interface WindowConfig extends CommonConfig {
    /** 切入系统后台时，隐藏页面内容，保护用户隐私。支持 hidden / none
     * @default none
     */
    visualEffectInBackground?: 'hidden' | 'none'
    /** 是否允许下拉刷新
     * 备注：下拉刷新生效的前提是 allowsBounceVertical 值为 YES
     * @default: "NO"
     */
    pullRefresh?: 'YES' | 'NO' | boolean
    /** 是否允许向下拉拽
     * @default: "YES"
     */
    allowsBounceVertical?: 'YES' | 'NO'
  }

  interface TabBarItem {
    /** 页面路径，必须在 pages 中先定义 */
    pagePath: string
    /** tab 上按钮文字 */
    text: string
    /** 图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，当 position 为 top 时，此参数无效，不支持网络图片 */
    iconPath?: string
    /** 选中时的图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px ，当 position 为 top 时，此参数无效 */
    selectedIconPath?: string
  }

  interface TabBar {
    /** tab 上的文字默认颜色 */
    color?: string
    /** tab 上的文字选中时的颜色 */
    selectedColor?: string
    /** tab 的背景色 */
    backgroundColor?: string
    /** tabbar上边框的颜色， 仅支持 black/white
     * @default: black
     */
    borderStyle?: 'black' | 'white'
    /** tab 的列表，详见 list 属性说明，最少 2 个、最多 5 个 tab */
    list: TabBarItem[]
    /** tabbar 的位置，可选值 bottom、top
     * @default: 'bottom'
     */
    position?: 'bottom' | 'top'
    /** 自定义 tabBar，见[详情](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html)
     * @default false
     * @since 2.1.0
     */
    custom?: boolean
  }

  interface NetworkTimeout {
    /** Taro.request 的超时时间，单位毫秒。
     * @default 60000
     */
    request?: number
    /** Taro.connectSocket 的超时时间，单位毫秒。
     * @default 60000
     */
    connectSocket?: number
    /** Taro.uploadFile 的超时时间，单位毫秒。
     * @default 60000
     */
    uploadFile?: number
    /** Taro.downloadFile 的超时时间，单位毫秒。
     * @default 60000
     */
    downloadFile?: number
  }

  interface SubPackage {
    /** 分包根路径
     * - 注意：不能放在主包pages目录下
     */
    root: string
    /** 分包路径下的所有页面配置 */
    pages: string[]
    /** 分包别名，分包预下载时可以使用 */
    name?: string
    /** 分包是否是独立分包 */
    independent?: boolean
    /** 分包支持引用独立的插件 */
    plugins?: Plugins
  }

  interface Plugins {
    [key: string]: {
      version: string
      provider: string
    }
  }

  interface PreloadRule {
    [key: string]: {
      /** 进入页面后预下载分包的 root 或 name。__APP__ 表示主包。 */
      packages: string[]
      /** 在指定网络下预下载，可选值为：
       * - all: 不限网络
       * - wifi: 仅wifi下预下载
       * @default "wifi"
       */
      network?: 'all' | 'wifi'
    }
  }

  interface Permission {
    [key: string]: {
      /** 小程序获取权限时展示的接口用途说明。最长30个字符 */
      desc: string
    }
  }

  interface SinglePage {
    /** 导航栏与页面的相交状态，值为 float 时表示导航栏浮在页面上，与页面相交；值为 squeezed 时表示页面被导航栏挤压，与页面不相交
     * @default "默认自动调整，若原页面是自定义导航栏，则为 float，否则为 squeezed"
     */
    navigationBarFit?: string
  }

  interface RouterAnimate {
    /** 动画切换时间，单位毫秒
     * @default 300
     */
    duration?: number
    /** 动画切换时间，单位毫秒
     * @default 50
     */
    delay?: number
  }

  interface AppConfig {
    /** 小程序默认启动首页，未指定 entryPagePath 时，数组的第一项代表小程序的初始页面（首页）。 */
    entryPagePath?: string
    /** 接受一个数组，每一项都是字符串，来指定小程序由哪些页面组成，数组的第一项代表小程序的初始页面 */
    pages?: string[]
    /** 全局的默认窗口表现 */
    window?: WindowConfig
    /** 底部 tab 栏的表现 */
    tabBar?: TabBar
    /** 各类网络请求的超时时间，单位均为毫秒。 */
    networkTimeout?: NetworkTimeout
    /** 是否开启 debug 模式，默认关闭
     * @default false
     */
    debug?: boolean
    /** 启用插件功能页时，插件所有者小程序需要设置其 functionalPages 为 true。
     * @see https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages.html
     * @default false
     * @since 2.1.0
     */
    functionalPages?: boolean
    /** 分包结构配置
     * @example
     * ```json
     * [
     *   {
     *     root: 'packages/module',
     *     pages: [
     *       'pages/page/index'
     *     ]
     *   }
     * ]
     * ```
     * @since 1.7.3
     */
    subPackages?: SubPackage[]
    subpackages?: SubPackage[]
    /** Worker 代码放置的目录
     * 使用 Worker 处理多线程任务时，设置 Worker 代码放置的目录
     * @since 1.9.90
     */
    workers?: string
    /** 申明需要后台运行的能力，类型为数组。目前支持以下项目：
     * - audio: 后台音乐播放
     * - location: 后台定位
     * @since 微信客户端 6.7.2 及以上版本支持
     */
    requiredBackgroundModes?: ('audio' | 'location')[]
    /** 申明需要使用的地理位置相关接口，类型为数组。目前支持以下项目：
     * 自 2022 年 7 月 14 日后发布的小程序，使用以下8个地理位置相关接口时，需要声明该字段，否则将无法正常使用。2022 年 7 月 14 日前发布的小程序不受影响。
     * - getFuzzyLocation: 获取模糊地理位置
     * - getLocation: 获取精确地理位置
     * - onLocationChange: 监听试试地理位置变化事件
     * - startLocationUpdate: 接收位置消息（前台）
     * - startLocationUpdateBackground: 接收位置消息（前后台）
     * - chooseLocation: 打开地图选择位置
     * - choosePoi: 打开 POI 列表选择位置
     * - chooseAddress: 获取用户地址信息
     *  @see https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#requiredPrivateInfos
     */
    requiredPrivateInfos?: ('getFuzzyLocation' | 'getLocation' | 'onLocationChange' | 'startLocationUpdate' | 'startLocationUpdateBackground' | 'chooseLocation' | 'choosePoi' | 'chooseAddress')[] 
    /** 使用到的插件
     * @since 1.9.6
     */
    plugins?: Plugins
    /** 声明分包预下载的规则。
     * preloadRule 中，key 是页面路径，value 是进入此页面的预下载配置
     * 注意: 分包预下载目前只支持通过配置方式使用，暂不支持通过调用API完成。
     *      vConsole 里有 preloadSubpackages 开头的日志信息，可以用来验证预下载的情况。
     * @since 2.3.0
     */
    preloadRule?: PreloadRule
    /** PC 小程序是否支持用户任意改变窗口大小（包括最大化窗口）；iPad 小程序是否支持屏幕旋转
     * @default false
     * @since 2.3.0
     */
    resizable?: boolean
    /** 需要跳转的小程序列表
     * @since 2.4.0
     */
    navigateToMiniProgramAppIdList?: string[]
    /** 全局自定义组件配置
     * @see https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
     */
    usingComponents?: Record<string, string>
    /** 小程序接口权限相关设置
     * @since 微信客户端 7.0.0
     */
    permission?: Permission
    /** 指明 sitemap.json 的位置 */
    sitemapLocation?: string
    /** 指定使用升级后的 weui 样式
     * - v2: 可表明启用新版的组件样式
     * @default default
     */
    style?: string
    /** 指定需要引用的扩展库
     * 指定需要引用的扩展库。目前支持以下项目：
     * - kbone: 多端开发框架
     * - weui: WeUI 组件库
     */
    useExtendedLib?: Record<string, boolean>
    /** 微信消息用小程序打开
     * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/location-message.html
     */
    entranceDeclare?: {
      /** 声明“位置消息”场景进入小程序的启动页面 */
      locationMessage?: {
        /** 启动页路径，必须是在pages中已经定义 */
        path?: string
        /** 启动页参数 */
        query?: string
      }
    }
    /**
     * 配置 darkMode 为 true，即表示当前小程序已适配 DarkMode
     * @since 2.11.0
     */
    darkmode?: boolean
    /** 指明 theme.json 的位置，darkmode为true为必填
     * @since 2.11.0
     */
    themeLocation?: string
    /** 配置自定义组件代码按需注入 */
    lazyCodeLoading?: string
    /** 单页模式相关配置 */
    singlePage?: SinglePage
    /** 聊天素材小程序打开相关配置
     * @see https://developers.weixin.qq.com/miniprogram/dev/framework/material/support_material.html
     */
    supportedMaterials?: {
      /** 支持文件类型的MimeType，音频，视频支持二级配置的通配模式，例如: video/*。通配模式配置和精确类型配置同时存在时，则优先使用精确类型的配置(例如video/*和video/mp4同时存在，会优先使用video/mp4的配置)。 */
      materialType: string
      /** 开发者配置的标题，在素材页面会展示该标题，配置中必须包含${nickname}, 代码包编译后会自动替换为小程序名称，如果声明了简称则会优先使用简称。除去${nickname}其余字数不得超过6个。 */
      name: string
      /** 用途描述，会在推荐列表展示该描述，限定字数不超过22个。 */
      desc: string
      /** 在该场景下打开小程序时跳转页面 */
      path: string
    }
    /** 定制化型服务商票据 */
    serviceProviderTicket?: string
    /** 半屏小程序 appId */
    embeddedAppIdList?: string[]
    /** 视频号直播半屏场景设置 */
    halfPage?: {
      /** 视频号直播打开的第一个页面的全屏状态使用自定义顶部，支持 */
      firstPageNavigationStyle?: 'default' | 'custom'
    }
    /** 小程序调试相关配置项 */
    debugOptions?: {
      /** 是否开启 FPS 面板，默认false */
      enableFPSPanel?: boolean
    }
    /** touch 事件监听是否为 passive，默认false */
    enablePassiveEvent?: boolean | {
      /** 是否设置 touchstart 事件为 passive，默认false */
      touchstart?: boolean
      /** 是否设置 touchmove 事件为 passive，默认false */
      touchmove?: boolean
      /** 是否设置 wheel 事件为 passive，默认false */
      wheel?: boolean
    }
    /** 自定义模块映射规则 */
    resolveAlias?: Record<string, string>
    /** 接受一个数组，每一项都是字符串，来指定编译为原生小程序组件的组件入口 */
    components?: string[]
    /** 渲染页面的容器 id
     * @default "app"
     * @since 3.3.18
     */
    appId?: string
    /** 是否开启 h5 端路由动画功能，默认开启
     * @supported h5
     * @since 3.3.18
     */
    animation?: RouterAnimate | boolean
  }

  interface Config extends PageConfig, AppConfig {
    cloud?: boolean
  }

  interface TaroStatic {
    CommonConfig: CommonConfig
    PageConfig: PageConfig
    WindowConfig: WindowConfig
    TarBarList: TabBarItem
    TabBar: TabBar
    NetworkTimeout: NetworkTimeout
    SubPackage: SubPackage
    Plugins: Plugins
    PreloadRule: PreloadRule
    Permission: Permission
    AppConfig: AppConfig
    RouterAnimate: RouterAnimate
    Config: Config
  }
}

