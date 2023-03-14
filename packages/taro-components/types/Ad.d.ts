import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface AdProps extends StandardProps {
  /** 广告单元id，可在[小程序管理后台](https://mp.weixin.qq.com/)的流量主模块新建
   * @supported weapp, tt, qq
   */
  unitId: string

  /** 广告自动刷新的间隔时间，单位为秒，参数值必须大于等于30（该参数不传入时 Banner 广告不会自动刷新）
   * @supported weapp, tt
   */
  adIntervals?: number

  /** 广告类型，默认为展示`banner`，可通过设置该属性为`video`展示视频广告, `grid`为格子广告
   * @supported weapp
   */
  adType?: 'banner' | 'video' | 'grid'

  /** 广告主题样式设置
   * @supported weapp
   */
  adTheme?: 'white' | 'black'

  /** 小程序应用 ID
   * @supported swan
   */
  appid?: string

  /** 小程序广告位 ID
   * @supported swan
   */
  apid?: string

  /** 广告类型：banner、feed ，需和百青藤平台上的代码位类型相匹配
   * @supported swan, tt, qq
   * @default feed
   * @swan 支持 banner、feed
   * @qq 支持 banner、card、feeds、block
   */
  type?: string

  /** 更改该属性，可以触发广告刷新
   * @supported swan
   */
  updatetime?: string

  /** 广告是否在屏幕中固定展示
   * @supported tt
   */
  fixed?: string

  /** 广告的缩放比例，100 为标准尺寸
   * @supported tt
   * @default 100
   */
  scale?: string

  /** type 为 feeds 时广告左边距（px），必须大于 0
   * @supported qq
   */
  adLeft?: string

  /** type 为 feeds 时广告上边距（px），必须大于 0
   * @supported qq
   */
  adTop?: string

  /** type 为 feeds 时广告宽度（px），默认 100%，最大值为屏幕宽度，最小值为 265
   * @supported qq
   */
  adWidth?: string

  /** type 为 feeds 时广告高度（px），最小 85，最大 160
   * @supported qq
   */
  adHeight?: string

  /** type 为 block 时请求积木广告数量（展示以实际拉取广告数量为准）
   * @supported qq
   * @default 1
   */
  blockSize?: string

  /** type 为 block 时请求积木广告排列方向
   * @supported qq
   * @default landscape
   */
  blockOrientation?: 'vertical' | 'landscape'

  /** 开发者工具下，type 为 banner 时，指定 banner 广告展示三图文还是单图
   * @supported qq
   * @default three
   */
  testBannerType?: 'one' | 'three'

  /** 广告加载成功的回调
   * @supported weapp, swan, tt, qq
   */
  onLoad?: CommonEventFunction

  /** 当广告发生错误时，触发的事件，可以通过该事件获取错误码及原因，事件对象 event.detail = {errCode: 1002}
   * @supported weapp, swan, tt, qq
   */
  onError?: CommonEventFunction<AdProps.onErrorEventDetail>

  /** 广告关闭的回调
   * @supported weapp, swan, tt
   */
  onClose?: CommonEventFunction

  /** 贴片类型广告播放期间触发
   * @supported swan
   */
  onStatus?: CommonEventFunction

  /** type 为 feeds 时广告实际宽高回调
   * @supported qq
   */
  onSize?: CommonEventFunction<AdProps.onSizeEventDetail>
}
declare namespace AdProps {
  interface onErrorEventDetail {
    errCode: keyof AdErrCode
  }

  /**
   * 广告错误码
   *
   * 错误码是通过onError获取到的错误信息。调试期间，可以通过异常返回来捕获信息。
   * 在小程序发布上线之后，如果遇到异常问题，可以在[“运维中心“](https://mp.weixin.qq.com/)里面搜寻错误日志，还可以针对异常返回加上适当的监控信息。
   */
  interface AdErrCode {
    /**
     * @illustrate 后端错误调用失败
     * @reason 该项错误不是开发者的异常情况
     * @solution 一般情况下忽略一段时间即可恢复。
     */
    1000

    /**
     * @illustrate 参数错误
     * @reason 使用方法错误
     * @solution 可以前往 developers.weixin.qq.com 确认具体教程（小程序和小游戏分别有各自的教程，可以在顶部选项中，“设计”一栏的右侧进行切换。
     */
    1001

    /**
     * @illustrate 广告单元无效
     * @reason 可能是拼写错误、或者误用了其他APP的广告ID
     * @solution 请重新前往 mp.weixin.qq.com 确认广告位ID。
     */
    1002

    /**
     * @illustrate 内部错误
     * @reason 该项错误不是开发者的异常情况
     * @solution 一般情况下忽略一段时间即可恢复。
     */
    1003

    /**
     * @illustrate 无合适的广告
     * @reason 广告不是每一次都会出现，这次没有出现可能是由于该用户不适合浏览广告
     * @solution 属于正常情况，且开发者需要针对这种情况做形态上的兼容。
     */
    1004

    /**
     * @illustrate 广告组件审核中
     * @reason 你的广告正在被审核，无法展现广告
     * @solution 请前往 mp.weixin.qq.com 确认审核状态，且开发者需要针对这种情况做形态上的兼容。
     */
    1005

    /**
     * @illustrate 广告组件被驳回
     * @reason 你的广告审核失败，无法展现广告
     * @solution 请前往 mp.weixin.qq.com 确认审核状态，且开发者需要针对这种情况做形态上的兼容。
     */
    1006

    /**
     * @illustrate 广告组件被封禁
     * @reason 你的广告能力已经被封禁，封禁期间无法展现广告
     * @solution 请前往 mp.weixin.qq.com 确认小程序广告封禁状态。
     */
    1007

    /**
     * @illustrate 广告单元已关闭
     * @reason 该广告位的广告能力已经被关闭
     * @solution 请前往 mp.weixin.qq.com 重新打开对应广告位的展现。
     */
    1008
  }
  interface onSizeEventDetail {
    width: number
    height: number
  }
}

/** Banner 广告
 * @classification open
 * @supported weapp, swan, tt, qq
 * @example_react
 * ```tsx
 * class App extends Component {
 *   render () {
 *     return (
 *       <Ad
 *         unitId=''
 *         adIntervals={60}
 *         onLoad={() => console.log('ad onLoad')}
 *         onError={() => console.log('ad onError')}
 *         onClose={() => console.log('ad onClose')}
 *       />
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <ad
 *     unit-id=""
 *     ad-intervals="60"
 *     `@load="onLoad"
 *     `@error="onError"
 *     `@close="onClose"
 *   />
 * </template>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/ad.html
 */
declare const Ad: ComponentType<AdProps>
export { Ad, AdProps }
