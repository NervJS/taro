import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface AdProps extends StandardProps {
  /** 广告单元id，可在[小程序管理后台](https://mp.weixin.qq.com/)的流量主模块新建
   * @supported weapp
   */
  unitId: string

  /** 广告自动刷新的间隔时间，单位为秒，参数值必须大于等于30（该参数不传入时 Banner 广告不会自动刷新）
   * @supported weapp
   */
  adIntervals?: number

  /** 广告加载成功的回调
   * @supported weapp
   */
  onLoad?: CommonEventFunction

  /** 当广告发生错误时，触发的事件，可以通过该事件获取错误码及原因，事件对象event.detail = {errCode: 1002}
   * @supported weapp
   */
  onError?: CommonEventFunction<AdProps.onErrorEventDetail>

  /** 广告关闭的回调
   * @supported weapp
   */
  onClose?: CommonEventFunction
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
     * @abnormal 后端错误调用失败
     * @reason 该项错误不是开发者的异常情况
     * @solution 一般情况下忽略一段时间即可恢复。
     */
    1000
    /**
     * @abnormal 参数错误
     * @reason 使用方法错误
     * @solution 可以前往 developers.weixin.qq.com 确认具体教程（小程序和小游戏分别有各自的教程，可以在顶部选项中，“设计”一栏的右侧进行切换。
     */
    1001
    /**
     * @abnormal 广告单元无效
     * @reason 可能是拼写错误、或者误用了其他APP的广告ID
     * @solution 请重新前往 mp.weixin.qq.com 确认广告位ID。
     */
    1002
    /**
     * @abnormal 内部错误
     * @reason 该项错误不是开发者的异常情况
     * @solution 一般情况下忽略一段时间即可恢复。
     */
    1003
    /**
     * @abnormal 无合适的广告
     * @reason 广告不是每一次都会出现，这次没有出现可能是由于该用户不适合浏览广告
     * @solution 属于正常情况，且开发者需要针对这种情况做形态上的兼容。
     */
    1004
    /**
     * @abnormal 广告组件审核中
     * @reason 你的广告正在被审核，无法展现广告
     * @solution 请前往 mp.weixin.qq.com 确认审核状态，且开发者需要针对这种情况做形态上的兼容。
     */
    1005
    /**
     * @abnormal 广告组件被驳回
     * @reason 你的广告审核失败，无法展现广告
     * @solution 请前往 mp.weixin.qq.com 确认审核状态，且开发者需要针对这种情况做形态上的兼容。
     */
    1006
    /**
     * @abnormal 广告组件被封禁
     * @reason 你的广告能力已经被封禁，封禁期间无法展现广告
     * @solution 请前往 mp.weixin.qq.com 确认小程序广告封禁状态。
     */
    1007
    /**
     * @abnormal 广告单元已关闭
     * @reason 该广告位的广告能力已经被关闭
     * @solution 请前往 mp.weixin.qq.com 重新打开对应广告位的展现。
     */
    1008
    // [key: number]: string
  }
}

/** Banner 广告
 * @classification open
 * @supported weapp
 * @example
 * ```tsx
 * class App extends Component {
 *   render () {
 *     return (
 *       <Ad
 *         unit-id=''
 *         ad-intervals={60}
 *         onLoad={() => console.log('ad onLoad')}
 *         onError={() => console.log('ad onError')}
 *         onClose={() => console.log('ad onClose')}
 *       />
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/ad.html
 */
declare const Ad: ComponentType<AdProps>

export { Ad, AdProps }
