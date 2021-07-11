import { ComponentType } from 'react'
import { BaseEventOrigFunction, CommonEventFunction, StandardProps, Text } from '@tarojs/components'

interface DivProps extends StandardProps {
  /**
   * 若 video 组件的直接父组件为 div 组件，且其enablevideofullscreencontainer值为 true，则开启全屏显示自定义组件特性。默认值为 false，特性为关闭状态
   * @supported quickapp
   */
  enablevideofullscreencontainer?: boolean
}

interface ListProps extends StandardProps {
  /**
   * 是否将 list 顶部页面中非 list 部分随 list 一起滑出可视区域，开启该属性会降低 list 渲染性能
   * @supported quickapp
   */
  scrollpage?: boolean

  /**
   * 列表滑动
   * @supported quickapp(1010+)
   */
  onScroll?: BaseEventOrigFunction<{
    scrollX: number
    scrollY: number
    /**
     * 0： list 停止滑动
     *
     * 1： list 正在通过用户的手势滑动
     *
     * 2： list 正在滑动，用户已松手
     */
    scrollState: 0 | 1 | 2
  }>

  /**
   * 列表滑动到底部
   * @supported quickapp
   */
  onScrollBottom?: CommonEventFunction

  /**
   * 列表滑动到顶部
   * @supported quickapp
   */
  onScrollTop?: CommonEventFunction

  /**
   * 列表滑动结束
   * @supported quickapp(1040+)
   */
  onScrollEnd?: CommonEventFunction

  /**
   * 列表滑动过程中手指抬起
   * @supported quickapp(1040+)
   */
  onScrollTouchUp?: CommonEventFunction
}

interface ListItemProps extends StandardProps {
  /**
   * list-item 类型，值为自定义的字符串，如'loadMore'。相同的 type 的 list-item 必须具备完全一致的 DOM 结构。因此，在 list-item 内部需谨慎使用 if 和 for，因为 if 和 for 可能造成相同的 type 的 list-item 的 DOM 结构不一致，从而引发错误
   * @supported quickapp
   */
  type: string
}

interface PopupProps extends StandardProps {
  /**
   * 目标元素选择器
   * @supported quickapp
   */
  target: string
  /**
   * 弹出窗口位置, 默认值：'bottom'
   * @supported quickapp
   */
  placement?: 'left' | 'right' | 'top' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  /**
   * 当显隐状态变化时回调，true 显示，false 隐藏
   * @supported quickapp
   */
  onVisibilityChange?: CommonEventFunction
}

interface RefreshProps extends StandardProps {
  /**
   * 刷新组件静止时距离顶部距离，默认值：132px
   * @supported quickapp
   */
  offset?: number
  /**
   * 刷新组件是否正在刷新
   * @supported quickapp
   */
  refreshing?: boolean
  /**
   * 两个可选值，不可动态修改
   *
   * auto: 默认效果，列表界面拉到顶后，列表不移动，下拉后有转圈弹出。
   *
   * pulldown: 列表界面拉到顶后，可以继续下拉一段，有回弹效果。
   *
   * @supported quickapp(1040+)
   */
  type?: 'auto' | 'pulldown'
  /**
   * 是否允许刷新组件下拉刷新, 默认值：true
   * @supported quickapp(1080+)
   */
  enableRefresh?: boolean
  /**
   * 下拉 refresh 组件，触发刷新操作
   * @supported quickapp
   */
  onRefresh?: BaseEventOrigFunction<{ refreshing: boolean }>
}

interface RichTextProps extends StandardProps {
  /**
   * 按照传统 WEB 页面的方式进行渲染
   * @supported quickapp
   */
  type: 'html'
  /**
   * 开始加载时触发
   * @supported quickapp(1070+)
   */
  onStart?: CommonEventFunction
  /**
   * 加载完成时触发
   * @supported quickapp(1070+)
   */
  onComplete?: CommonEventFunction
}

interface StackProps extends StandardProps {
  /**
   * 进入和退出全屏时触发
   * @supported quickapp(1050+)
   */
  onFullScreenChange?: BaseEventOrigFunction<{ fullscreen: boolean }>
}

interface SwiperProps extends StandardProps {
  /**
   * 当前显示的子组件索引，默认值：0
   * @supported quickapp
   */
  index?: number
  /**
   * 渲染完成后，是否自动进行播放
   * @supported quickapp
   */
  autoplay?: boolean
  /**
   * 自动播放时的时间间隔，单位毫秒。默认值：3000ms
   * @supported quickapp
   */
  interval?: number
  /**
   * 是否启用 indicator，默认 true
   * @supported quickapp
   */
  indicator?: boolean
  /**
   * 是否开启循环模式，1030及以下版本子组件数量大于 2 时才生效
   * @supported quickapp(1010+)
   */
  loop?: boolean
  /**
   * 滑动动画时长(duration默认根据手指的速度动态计算)
   * @supported quickapp(1040+)
   */
  duration?: number
  /**
   * 滑动方向是否为纵向,纵向时indicator 也为纵向
   * @supported quickapp(1040+)
   */
  vertical?: boolean
  /**
   * 前边距，可用于露出前一项的一小部分，支持单位：px和%
   * @supported quickapp(1040+)
   */
  previousMargin?: string
  /**
   * 后边距，可用于露出后一项的一小部分，支持单位：px和%
   * @supported quickapp(1040+)
   */
  nextMargin?: string
  /**
   * 是否支持手势滑动swiper，默认值：true
   * @supported quickapp(1080+)
   */
  enableSwipe?: boolean
  /**
   * 当前显示的组件索引变化时触发
   * @supported quickapp
   */
  onChange?: BaseEventOrigFunction<{ index: number }>
}

interface TabsProps extends StandardProps {
  /**
   * 当前 active tab 索引
   * @supported quickapp
   */
  index?: number
  /**
   * tabs 子组件 active 变化时触发
   * @supported quickapp
   */
  onChange?: BaseEventOrigFunction<{ index: number }>
}

interface TabBarProps extends StandardProps {
  /**
   * mode 为 scrollable 时，子组件宽度为设置宽度，当宽度之和大于 tab-bar 宽度，子组件可以横向滚动；mode 为 fixed 时，子组件宽度均分 tab-bar 宽度，当宽度之和大于 tab-bar 宽度，子组件依旧均分宽度
   *
   * 默认值：'fixed'
   */
  mode?: 'scrollable' | 'fixed'
}

interface TabContentProps extends StandardProps {
  /**
   * 是否可以通过滑动切换页面。设置为false后，页面的切换需通过与 tab-bar 的联动实现
   *
   * 默认值：true
   * @supported quickapp(1040+)
   */
  scrollable?: boolean
}

interface AProps extends StandardProps {
  /**
   * 支持的格式参见页面路由中的 uri 参数。
   *
   * 额外的:
   *
   * href 还可以通过“?param1=value1”的方式添加参数，参数可以在页面中通过`this.param1`的方式使用
   *
   * href 还支持 http 和 https 开头的网址，点击后会打开 webview 加载网页
   *
   * @supported quickapp
   *
   * @example 示例:
   * <a href="About?param1=value1">关于</a>
   * <a href="/about?param1=value1">关于</a>
   * <a href="https://www.quickapp.cn/?param1=value1">快应用官方网站</a>
   */
  href?: string
}

interface ImageProps extends StandardProps {
  /**
   * 图片的 uri，同时支持本地和云端路径，支持的图片格式包括静态类型（png, jpg）和动态类型（gif）。
   *
   * 另外，也支持 svg 类型（svg）1020+ 与 HEIF 类型（heic/heif) 1090+ 图片格式。
   *
   * HEIF 格式图片浏览需设备硬件支持，以及Android 10+版本的系统
   *
   * @supported quickapp
   */
  src?: string
  /**
   * 加载时显示的占位图；只支持本地图片资源。
   * @supported quickapp(1060+)
   */
  alt?: string | 'blank'
  /**
   * 控制 gif/webp 图片是否自动播放动画。值设置为 true，图片可见时自动播放，不可见时自动停止播放；值设置为 false，图片不自动播放，需要开发者调用播放接口启动动画。
   * @default true
   * @supported quickapp(1080+)
   */
  autoplay?: boolean
  /**
   * 图片加载完成时触发
   * @supported quickapp(1030+)
   */
  onComplete?: BaseEventOrigFunction<{ width: number, height: number }>
  /**
   * 图片加载失败时触发
   * @supported quickapp(1030+)
   */
  onError?: CommonEventFunction
}

interface ProgressProps extends StandardProps {
  /**
   * 当前进度(type 为 circular 时不生效)
   * @supported quickapp
   */
  percent?: number
  /**
   * 进度条类型，不支持动态修改
   * @default 'horizontal'
   * @supported quickapp
   */
  type?: 'horizontal' | 'circular'
}

interface RatingProps extends StandardProps {
  /**
   * 星级总数
   * @default 5
   * @supported quickapp
   */
  numstars?: number
  /**
   * 评星数
   * @default 0
   * @supported quickapp
   */
  rating?: number
  /**
   * 评星步长
   * @default 0.5
   * @supported quickapp
   */
  stepsize?: number
  /**
   * 是否作为一个指示器(用户不可操作)
   * @default false
   * @supported quickapp
   */
  indicator?: boolean
  /**
   * 评星数发生改变时触发
   * @supported quickapp
   */
  onChange?: BaseEventOrigFunction<{
    rating: number,
    /**
     * 该事件是否由于用户拖动触发
     * @supported quickapp(1080+)
     */
    isFromUser: boolean
  }>
}

interface MarqueeProps extends StandardProps {
  /**
   * 设置每次滚动时移动的长度，单位：px
   * @default 6
   * @supported quickapp
   */
  scrollamount?: number
  /**
   * 设置 marquee 滚动的次数。如果未指定值，默认值为 −1，表示 marquee 将连续滚动
   * @default -1
   * @supported quickapp
   */
  loop?: number
  /**
   * 文字滚动方向，支持 left，right
   * @default 'left'
   * @supported quickapp
   */
  direction?: 'left' | 'right'
  /**
   * 当 marquee 滚动到结尾时触发
   * @supported quickapp
   */
  onBounce?: CommonEventFunction
  /**
   * 当 marquee 完成 loop 属性设置的值时触发。它只能在 loop 属性设置为大于 0 的某个数字时触发
   * @supported quickapp
   */
  onFinish?: CommonEventFunction
  /**
   * 当 marquee 开始滚动时触发
   * @supported quickapp
   */
  onStart?: CommonEventFunction
}

interface InputProps extends StandardProps {
  /**
   * 支持动态修改 1030+
   * @default 'text'
   * @supported quickapp(1050+)
   */
  type?: 'button' | 'checkbox' | 'radio' | 'text' | 'email' | 'date' | 'time' | 'number' | 'password' | 'tel'
  /**
   * 当前组件的 checked 状态，可触发 checked 伪类，type 为 checkbox 时生效
   * @supported quickapp
   */
  checked?: boolean
  /**
   * input 组件名称
   * @supported quickapp
   */
  name?: string
  /**
   * input 组件的值
   * @supported quickapp
   */
  value?: string
  /**
   * 提示文本的内容，type 为 text|email|date|time 时生效
   * @supported quickapp
   */
  placeholder?: string
  /**
   * 组件可接收用户输入字符的最大长度
   * @supported quickapp(1010+)
   */
  maxlength?: number
  /**
   * 设置软键盘 Enter 按钮的显示文本或图标．
   * @supported quickapp(1010+)
   */
  enterkeytype?: 'default' | 'send' | 'search' | 'next' | 'go' | 'done' | 'default'
  /**
   * 是否开启自动提示功能，当 type 为 tel 时生效
   * @default 'on'
   * @supported quickapp(1050+)
   */
  autocomplete?: 'on' | 'off'
  /**
   * 不同 type 参数不同，具体见下方 change 事件参数	input 组件的值、状态发生改变时触发, type 为 button 时无 change 事件
   * @supported quickapp
   */
  onChange?: BaseEventOrigFunction<{
    value: string
  }>
  /**
   * 软键盘 Enter 键点击事件
   * @supported quickapp(1010+)
   */
  onEnterkeyClick?: BaseEventOrigFunction<{
    /**
     * value 为用户输入的值
     */
    value: string
  }>
  /**
   * 选中文本改变和光标移动时触发
   * @supported quickapp(1030+)
   */
  onSelectionChange?: CommonEventFunction
}

interface OptionProps extends StandardProps {
  /**
   * 选择项是否为下拉列表的默认项
   * @supported quickapp
   */
  selected?: boolean
  /**
   * 选择项的值
   * @supported quickapp
   */
  value: string
}

interface LabelProps extends StandardProps {
  /**
   * 目标 input 组件 id
   * @supported quickapp
   */
  target?: string
}

type PickerProps = PickerProps.NormalPickerProps | PickerProps.DatePickerProps | PickerProps.TimePickerProps | PickerProps.MultiPickerProps

declare namespace PickerProps {
  interface NormalPickerProps {
    type: 'text'
    /** 选择器的取值范围 */
    range?: any[]
    /**选择器的默认取值，取值为 range 的索引 */
    selected?: number
    /**选择器的值 */
    value: string
  }

  interface DatePickerProps {
    type: 'date'
    /**
     * 起始时间，格式为 yyyy-MM-dd
     * @default '1970-1-1
     */
    start?: string
    /**
     * 结束时间，格式为 yyyy-MM-dd
     * @default '2100-12-31'
     */
    end?: string
    /**
     * 选择器的默认取值，格式为 yyyy-MM-dd
     * @default 当前时间
     */
    selected?: string
    /**
     * 选择器的值
     */
    value?: string
  }

  interface TimePickerProps {
    /**
     * 选择器的默认取值，格式为 hh:mm
     * @default 当前时间
     */
    selected?: string
    /**
     * 选择器的值
     */
    value?: string
  }

  interface MultiPickerProps {
    /**
     * range 为二维数组。长度表示多少列，数组的每项表示每列的数据，如 [["a","b"], ["c","d"]]
     */
    range?: string[][]
    /**
     * 每一列被选中项对应的索引构成的数组
     */
    selected?: number[]
    /**
     * 每一列被选中项对应的值构成的数组
     */
    value?: string[]
  }

}

interface SelectProps extends StandardProps {
  /**
   * 下拉选择器选择值后触发
   * @supported quickapp
   */
  onChange?: BaseEventOrigFunction<{ newValue: string }>
}

interface SliderProps extends StandardProps {
  min?: number
  /** @default 100 */
  max?: number
  /** @default 1 */
  step?: number
  value?: number
  /**
   * 完成一次拖动后触发的事件
   */
  onChange?: BaseEventOrigFunction<{
    progress: number,
    /**
     * 该事件是否由于用户拖动触发
     * @supported quickapp(1080+)
     */
    isFromUser: boolean
  }>
}

interface SwitchProps extends StandardProps {
  /**
   * 可触发 checked 伪类
   */
  checked?: boolean
  /**
   * checked 状态改变时触发
   */
  onChange?: BaseEventOrigFunction<{ checked: boolean }>
}

interface TextAreaProps extends StandardProps {
  /**
   * 提示文本的内容
   */
  placeholder?: string
  /**
   * 组件可接收用户输入字符的最大长度
   * @supported quickapp(1010+)
   */
  maxlength?: number
  /**
   * 输入内容发生变化时触发
   */
  onChange?: BaseEventOrigFunction<{ text: string }>
  /**
   * 选中文本改变和光标移动时触发
   * @supported quickapp(1030+)
   */
  onSelectionChange?: CommonEventFunction
  /**
   * 输入框行数变化时调用，height为当前输入框高度，lineCount为当前文本行数
   * @supported quickapp(1060+)
   */
  onLineChange?: BaseEventOrigFunction<{ height: number, lineCount: number }>
}

interface VideoProps extends StandardProps {
  /**
   * 视频播放内容的 uri
   */
  src?: string
  /**
   * 渲染后是否自动播放
   */
  autoplay?: boolean
  /**
   * 视频预览海报
   */
  poster?: string
  /**
   * 是否显示默认控件
   * @default true
   * @supported quickapp(1010+)
   */
  controls?: boolean
  /**
   * 是否静音播放
   * @supported quickapp(1030+)
   */
  muted?: boolean
  /**
   * 指定点击默认控件的全屏按钮时视频进入的全屏方向。
   * @default 'landscape'
   * @supported quickapp(1070+)
   */
  orientation?: 'landscape' | 'portrait'
  /**
   * 指定视频组件全屏播放时是否显示顶栏，true为显示,false为不显示，在非全屏时均不显示顶栏
   * @default true
   * @supported quickapp(1070+)
   */
  titlebar?: boolean
  /**
   * 配置全屏播放时顶栏显示的标题，最多只支持一行文案，超过会自动以省略号结尾截断
   * @supported quickapp(1070)
   */
  title?: string
  /**
   * 循环播放次数，可设置为 infinite 无限次播放
   * @default 1
   * @supported quickapp(1080+)
   */
  playcount?: number | 'infinite'
  /**
   * 若 video 组件的直接父组件为 div 组件，且其enablevideofullscreencontainer值为 true，则开启全屏显示自定义组件特性。默认值为 false，特性为关闭状态
   * @default false
   * @supported quickapp(1080+)
   */
  enablevideofullscreencontainer?: boolean
  /**
   * 视频连接成功时触发
   */
  onPrepared?: BaseEventOrigFunction<{
    /** 秒 */
    duration: number
  }>
  /**
   * 开始播放时触发
   */
  onStart?: CommonEventFunction
  /**
   * 暂停时触发
   */
  onPause?: CommonEventFunction
  /**
   * 播放结束时触发
   */
  onFinish?: CommonEventFunction
  /**
   * 播放失败时触发
   */
  onError?: CommonEventFunction
  /**
   * 播放进度条滑动时触发
   */
  onSeeking?: BaseEventOrigFunction<{
    /** 秒 */
    currenttime: number
  }>
  /**
   * 播放进度条滑动放开时触发
   */
  onSeeked?: BaseEventOrigFunction<{
    /** 秒 */
    currenttime: number
  }>
  /**
   * 播放进度变化时触发，触发频率 4HZ
   */
  onTimeUpdate?: BaseEventOrigFunction<{
    /** 秒 */
    currenttime: number
  }>
  /**
   * 视频进入和退出全屏时触发
   */
  onFullScreenChange?: BaseEventOrigFunction<{
    fullscreen: boolean
  }>
}

interface CameraProps extends StandardProps {
  /**
   * 前置或后置，值为 front，back
   */
  deviceposition?: 'front' | 'back'
  /**
   * 闪光灯，值为 auto，on，off，torch(手电筒常亮模式)
   */
  flash?: 'auto' | 'on' | 'off' | 'torch'
  /**
   * 相机帧数据尺寸，值为 low，normal，high
   * @default 'normal'
   * @supported quickapp(1080+)
   */
  framesize?: 'low' | 'normal' | 'high'
  /**
   * 曝光锁定
   * @supported quickapp(1080+)
   */
  autoexposurelock?: boolean
  /**
   * 白平衡锁定
   * @supported quickapp(1080+)
   */
  autowhitebalancelock?: boolean
  /**
   * 用户不允许使用摄像头时触发
   */
  onError?: CommonEventFunction
  /**
   * @supported quickapp(1080+)
   */
  onCameraFrame?: BaseEventOrigFunction<{
    /**
     * 图像像素点数据，一维数组，每四项表示一个像素点的 rgba
     */
    data: ArrayBuffer
    /** 图像数据矩形的宽度 */
    width: number
    /** 图像数据矩形的高度 */
    height: number
  }>
  /**
   * 相机初始化完成时触发
   * @supported quickapp(1080+)
   */
  onCameraInitDone?: BaseEventOrigFunction<object>
}

interface WebProps extends StandardProps {
  /**
   * 需要加载的页面地址
   */
  src?: string
  /**
   * 可信任的网址，支持正则表达式。只有 trustedurl 中链接或者 src 链接的网页可以和框架进行双向通信
   * @supported quickapp(1020+)
   */
  trustedurl?: string[]
  /**
   * 是否支持第三方 cookies，设置为 true 时开启接收第三方 cookies。 注意：allowthirdpartycookies只支持安卓 5.0 及以上系统。5.0 以下默认为 true
   * @supported quickapp(1030+)
   */
  allowthirdpartycookies?: boolean
  /**
   * 是否展示默认加载框
   * @supported quickapp(1070+)
   */
  showloadingdialog?: boolean
  /**
   * 网页是否支持放大缩小
   * @default true
   * @supported quickapp(1070+)
   */
  supportzoom?: boolean
  /**
   * 设置web组件的userAgent，默认使用快应用的UA。
   * - 设置为system，表示使用系统默认UA。
   * - 设置其他字符串属于自定义UA。
   * - 不设置此字段或者传入空值，使用默认快应用UA。
   *
   * @supported quickapp(1091+)
   */
  useragent?: string
  /**
   * 开始加载网页时触发，参数详情说明如下
   */
  onPageStart?: BaseEventOrigFunction<{

    url: string,
    /**
     * 是否可以向后浏览
     * @supported quickapp(1080+)
     */
    canBack: boolean,
    /**
     * 是否可以向前浏览
     * @supported quickapp(1080+)
     */
    canForward: boolean
  }>
  /**
   * 网页加载完成时触发
   */
  onPageFinish?: BaseEventOrigFunction<{ url: string, canBack: boolean, canForward: boolean }>
  /**
   * 收到网页标题时触发
   */
  onTitleReceive?: BaseEventOrigFunction<{ title: string }>
  /**
   * 网页加载出现错误时触发，参数详情说明如下
   */
  onError?: BaseEventOrigFunction<{
    errorMsg: string,
    /**
     * webview加载资源出错时，当前访问资源的链接地址
     * @supported quickapp(1080+)
     */
    url: string,
    /**
     * webview加载资源出错时，当前webview是否可以向后浏览
     * @supported quickapp(1080+)
     */
    canBack: boolean,
    /**
     * webview加载资源出错时，当前webview是否可以向前浏览
     * @supported quickapp(1080+)
     */
    canForward: boolean
    /**
     * webview加载资源出错时，当前错误的所属类型：
     * 0：通用错误
     * 1：http错误
     * 2：证书错误
     * (1080+)
     */
    errorType: 0 | 1 | 2,
    /**
     * webview加载资源出错时，当前返回的错误码，例如：404，500等
     * @supported quickapp(1080+)
     */
    code: number,
    /**
     * webview加载资源出错时，当前的错误信息描述
     * @supported quickapp(1080+)
     */
    description: string,
    /**
     * webview加载资源出错时，当前的异常域名是否已经授权（默认值为false，主要用于证书错误）
     * @supported quickapp(1080+)
     */
    isAuthorized: boolean
  }>
  /**
   * 接收到网页发来的消息时触发
   * @supported quickapp(1020+)
   */
  onMessage?: BaseEventOrigFunction<{ message: string, url: string }>
  /**
   * 当前进度，范围 0~100
   * @supported quickapp(1070+)
   */
  onProgress?: BaseEventOrigFunction<{ progress: number }>
}

declare module '@tarojs/components' {
  /**
   * 基本容器
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/div.html
   */
  export const QkDiv: ComponentType<DivProps>

  /**
   * 列表视图容器
   *
   * 子组件：仅支持\<list-item>
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/list.html
   */
  export const QkList: ComponentType<ListProps>

  /**
   * \<list>的子组件，用来展示列表具体 item，宽度默认充满 list 组件
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/list-item.html
   */
  export const QkListItem: ComponentType<ListItemProps>

  /**
   * 在点击控件或者某个区域后，浮出一个气泡来引导用户，气泡内容通过子组件来定义。如果设置了遮罩层，可通过点击遮罩层的任意位置退出，否则点击气泡外的任意区域退出
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/popup.html
   */
  export const QkPopup: ComponentType<PopupProps & { children?: (typeof Text)[] }>

  /**
   * 下拉刷新容器
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/refresh.html
   */
  export const QkRefresh: ComponentType<RefreshProps>

  /**
   * 富文本容器
   *
   * 文本内容直接写在标签内容区，内容格式需与 type 相匹配，只支持静态内容，由于需要实时编译，文本内容尽量不要频繁改变，否则可能导致性能问题
   *
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/richtext.html
   */
  export const QkRichText: ComponentType<RichTextProps>

  /**
   * 基本容器，子组件排列方式为层叠排列，每个直接子组件按照先后顺序依次堆叠，覆盖前一个子组件
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/stack.html
   */
  export const QkStack: ComponentType<StackProps>

  /**
   * 滑块视图容器
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/swiper.html
   */
  export const QkSwiper: ComponentType<SwiperProps>

  /**
   * tab 容器
   *
   * 子组件: 仅支持最多一个\<tab-bar>和最多一个\<tab-content>
   *
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/tabs.html
   */
  export const QkTabs: ComponentType<TabsProps>

  /**
   * \<tabs>的子组件，用来展示 tab 的标签区，子组件排列方式为横向排列   *
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/tab-bar.html
   */
  export const QkTabBar: ComponentType<TabBarProps>

  /**
   * \<tabs>的子组件，用来展示 tab 的内容区，高度默认充满 tabs 剩余空间，子组件排列方式为横向排列
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/tab-content.html
   */
  export const QkTabContent: ComponentType<TabContentProps>

  /**
   * 超链接（默认不带下划线）
   *
   * 文本内容写在标签内容区，支持转义字符"\"
   *
   * 子组件：仅支持\<span>
   *
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/tab-content.html
   */
  export const QkA: ComponentType<AProps>

  /**
   * 渲染图片
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/image.html
   */
  export const QkImage: ComponentType<ImageProps>

  /**
   * 进度条
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/progress.html
   */
  export const QkProgress: ComponentType<ProgressProps>

  /**
   * 星级评分
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/rating.html
   */
  export const QkRating: ComponentType<RatingProps>

  /**
   * 格式化的文本，只能作为\<text>、\<a>和\<span>的子组件
   *
   * 子组件：仅支持\<span> (1050+)
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/span.html
   */
  export const QkSpan: ComponentType<StandardProps>

  /**
   * 文本
   *
   * 文本内容写在标签内容区，支持转义字符"\"
   *
   * 子组件：仅支持\<a>与\<span>
   *
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/text.html
   */
  export const QkText: ComponentType<StandardProps>

  /**
   * 跑马灯
   *
   * 跑马灯用来插入一段滚动的文字，默认为单行。
   *
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/marquee.html
   */
  export const QkMarquee: ComponentType<MarqueeProps>

  /**
   * 提供可交互的界面，接收用户的输入，默认为单行
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/input.html
   */
  export const QkInput: ComponentType<InputProps>

  /**
   * 为 input、textarea 组件定义标注
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/label.html
   */
  export const QkLabel: ComponentType<LabelProps>

  /**
   * \<select>的子组件，用来展示下拉选择具体项目
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/option.html
   */
  export const QkOption: ComponentType<OptionProps>

  /**
   * 滚动选择器，目前支持四种选择器，普通选择器，日期选择器，时间选择器，多列文本选择器1010+。默认为普通选择器。
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/picker.html
   */
  export const QkPicker: ComponentType<PickerProps>

  /**
   * 下拉选择按钮，点击会弹出一个包含所有可选值的下拉菜单，从该菜单中可以选择一个新值
   *
   * 子组件：仅支持<option>
   *
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/select.html
   */
  export const QkSelect: ComponentType<SelectProps>

  /**
   * 滑动选择器
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/slider.html
   */
  export const QkSlider: ComponentType<SliderProps>

  /**
   * 开关选择
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/switch.html
   */
  export const QkSwitch: ComponentType<SwitchProps>

  /**
   * 提供可交互的界面，接收用户的输入，默认为多行
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/textarea.html
   */
  export const QkTextArea: ComponentType<TextAreaProps>

  /**
   * Video 组件，提供了视频播放器的功能，从1080版本开始支持全屏显示自定义组件，入门请参考教程
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/video.html
   */
  export const QkVideo: ComponentType<VideoProps>

  /**
   * 相机组件
   */
  export const QkCamera: ComponentType<CameraProps>

  /**
   * 画布组件，通过使用 JavaScript 中的脚本，可以在 canvas 上绘制图形，制作照片，创建动画等。
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/canvas.html
   */
  export const QkCanvas: ComponentType<StandardProps>

  /**
   * 用于显示在线的 html 页面，在 webview 的 useragent 后追加内容，格式是 hap/<平台版本号>/<厂商标识> <平台应用包名>/<平台应用版本号> <应用名>/<应用版本号> (<来源信息>)。“来源信息”与 app 接口的 getInfo 方法返回结果中的 source 字段相同。
   *
   * 使用 web 组件，必须声明"打开网页"接口，否则会提示缺乏权限。
   *
   * 11010+ 支持上传文件，不支持多选。 1020+ 支持下载文件。 1040+ 支持定位。
   *
   * 1由于各厂商系统 webview 已不再支持非安全域的 web 定位请求，为保证定位成功率和精度，请尽快升级您的站点到 HTTPS。
   *
   * 11040+ 支持 h5 页面中 input 标签的拍照、录视频、录音频以及音频、视频、图片文件选择。
   *
   * 1accept 字段内容（audio/ 表示音频 ， video/ 表示视频 ，image/* 表示图片 或者其他有效 MIME 类型）。
   *
   * 1090+ 支持 h5 页面中 input 标签的capture属性。
   *
   * @supported quickapp
   * @see https://doc.quickapp.cn/widgets/web.html
   */
  export const QkWeb: ComponentType<WebProps>
}
