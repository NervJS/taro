import type { IOption } from './util'

type FeatureItem = {
  name: string
}

declare enum LogLevel {
  OFF = 'off',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  LOG = 'log',
  DEBUG = 'debug'
}

export type SystemConfig = {
  /**
   * 打印日志等级，分为 off,error,warn,info,log,debug
   */
  logLevel?: LogLevel
  /**
   * 页面设计基准宽度，根据实际设备宽度来缩放元素大小
   */
  designWidth?: number
  /**
   * 全局数据对象，属性名不能以$或_开头，在页面中可通过 this 进行访问;如果全局数据属性与页面的数据属性重名，则页面初始化时，全局数据会覆盖页面中对应的属性值
   */
  data?: IOption
}

type RouterConfig = {
  /**
   * 首页名称
   */
  entry: string
  /**
   * 页面配置列表，key 值为页面名称（对应页面目录名，例如 Hello 对应'Hello'目录），value 为页面详细配置 page
   */
  pages: RouterPage[]
}
type RouterPage = {
  /**
   * 页面对应的组件名，与 ux 文件名保持一致，例如'hello' 对应 'hello.ux'
   */
  component: string
  /**
   * 页面路径，例如“/user”,不填则默认为/<页面名称>。
   * path 必须唯一,不能和其他 page 的 path 相同。
   * 下面 page 的 path 因为缺失,会被设置为“/Index”：
   * "Index": {"component": "index"}
   */
  path?: string
  /**
   * 声明页面可以处理某种请求
   */
  filter: {
    [key: string]: {
      uri: string
    }
  }
}

interface IDefaultDisplayConfig {
  /**
   * 窗口背景颜色
   */
  backgroundColor?: string
  /**
   * 是否是全屏模式，默认不会同时作用于 titleBar，titleBar 需要继续通过 titleBar 控制
   */
  fullScreen?: boolean
  /**
   * 是否显示 titleBar
   */
  titleBar?: boolean
  /**
   * 标题栏背景色
   */
  titleBarBackgroundColor?: string
  /**
   * 标题栏文字颜色
   */
  titleBarTextColor?: string
  /**
   * 标题栏文字(也可通过页面跳转传递参数(titleBarText)设置)
   */
  titleBarText?: string
  /**
   * 是否显示标题栏右上角菜单按钮，点击菜单按钮调用页面生命周期 onMenuPress 方法，如果该方法未实现则显示系统默认菜单
   */
  menu?: boolean
  /**
   * 软键盘弹出时为保证输入框可见，页面的调整方式。　adjustPan:上移页面; adjustResize:压缩页面显示区域，当页面全屏时，此设置不生效
   */
  windowSoftInputMode?: 'adjustPan' | 'adjustResize'
}

interface IDisplayConfig extends IDefaultDisplayConfig {
  /**
   * 各个页面的显示样式，key 为页面名（与路由中的页面名保持一致），value 为窗口显示样式，页面样式覆盖 default 样式
   */
  pages?: {
    [key: string]: IDefaultDisplayConfig
  }
}

export interface ITaroManifestConfig {
  /**
   * 应用包名，确认与原生应用的包名不一致，推荐采用 com.company.module 的格式，如：com.example.demo
   */
  package: string
  /**
   * 应用名称，6 个汉字以内，与应用商店保存的名称一致，用于在桌面图标、弹窗等处显示应用名称
   */
  name: string
  /**
   * 应用图标，提供 192x192 大小的即可
   */
  icon: string
  /**
   * 应用版本名称，如："1.0"
   */
  versionName?: string
  /**
   * 应用版本号，从1自增，推荐每次重新上传包时versionCode+1
   */
  versionCode: number
  /**
   * 支持的最小平台版本号，兼容性检查，避免上线后在低版本平台运行并导致不兼容；如果不填按照内测版本处理
   */
  minPlatformVersion?: string
  /**
   * 接口列表，绝大部分接口都需要在这里声明，否则不能调用，详见每个接口的文档说明
   */
  features?: FeatureItem[]
  /**
   *
   */
  logLevel?: LogLevel
}

export interface IManifestConfig extends ITaroManifestConfig {
  /**
   * 系统配置信息
   */
  config: SystemConfig
  /**
   * 路由信息
   */
  router: RouterConfig
  /**
   * UI 显示相关配置
   */
  display?: IDisplayConfig
}
