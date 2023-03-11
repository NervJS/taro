import { ComponentType } from 'react'
import { StandardProps } from './common'
interface LottieProps extends StandardProps {
  /** 是否自动播放。
   * @supported alipay
   * @default false
   */
  autoplay?: boolean
  /** Lottie 资源地址。包含近端（包内地址）和远端（网络）的 JSON 文件地址。
   * 与 djangoId 二选一。
   * @supported alipay
   */
  path?: string
  /** 播放速度。正数为正向播放，负数负向播放。
   * @supported alipay
   * @default 1.0
   */
  speed?: number
  /** 循环次数。
   *
   * 如果是负数表示无限次。
   * 如果是 0 表示不循环，播放一次。
   * 如果是 1 表示循环一次，播放两次。
   * @supported alipay
   * @default 0
   */
  repeatCount?: number
  /** 是否自动回播。
   * @supported alipay
   * @default false
   */
  autoReverse?: boolean
  /** 资源地址。"/" 表明是小程序根目录。
   * @supported alipay
   */
  assetsPath?: string
  /** 兜底图或者降级图地址。
   *
   * 1. 支持本地资源，案例：'/image/lottie/lottie2_default.png'。
   * 支持 http 的 cdn 地址、近端地址。
   * 小程序场景不支持 djangoId。
   * @supported alipay
   */
  placeholder?: string
  /** 在线资源的 md5 校验。
   * djangoId=https://b.zip。
   * 可以使用 b.zip 加密 获取 md5 值
   * md5="77c6c86fc89ba94cc0a9271b77ae77d2"
   * @supported alipay
   */
  md5?: string
  /** 降级。降级是指如遇低端设备，Lottie 会降级展示为 placeholder。
   * 当 optimize 为 true ，并且传入了 placeholder 时，在低端设备上只会展示 placeholder，不展示 Lottie。
   * 低端设备如下所示：
   *
   * iOS ：小于等于 iPhone6P
   * Android：内存容量小于 3G
   * @supported alipay
   * @default false
   */
  optimize?: boolean
  /** 当数据下载+视图创建完成时触发。
   * @supported alipay
   */
  onDataReady?: CommonEventFunction
  /** 数据加载失败时触发。
   * @supported alipay
   */
  onDataFailed?: CommonEventFunction
  /** 动画开始时触发。
   * @supported alipay
   */
  onAnimationStart?: CommonEventFunction
  /** 动画结束时触发。
   * @supported alipay
   */
  onAnimationEnd?: CommonEventFunction
  /** 动画一次重播结束。
   * @supported alipay
   */
  onAnimationRepeat?: CommonEventFunction
  /** 动画取消。业务调用 Cancel 时回调。
   * @supported alipay
   */
  onAnimationCancel?: CommonEventFunction
  /** 参数化时，数据准备完成，等待业务传入参数化值。
   * @supported alipay
   */
  onDataLoadReady?: CommonEventFunction
}
/** Lottie
 * @classification media
 * @supported alipay
 * @see https://opendocs.alipay.com/mini/component/lottie
 */
declare const Lottie: ComponentType<LottieProps>
export { Lottie, LottieProps }
