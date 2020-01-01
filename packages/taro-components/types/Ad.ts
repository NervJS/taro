import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

/**
 * 广告。目前暂时以邀请制开放申请，请留意后续模板消息的通知
 * @since 1.9.94
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/ad.html
 */
export interface AdProps extends StandardProps {

  /**
   * 广告单元id，可在小程序管理后台的流量主模块新建
   */
  unitId: string,

  /**
   * 广告加载成功的回调
   */
  onLoad?: CommonEventFunction,

  /**
   * 当广告发生错误时，触发的事件，可以通过该事件获取错误码及原因，事件对象event.detail = {errCode: 1002}
   */
  onError?: CommonEventFunction,
}

/** 广告。目前暂时以邀请制开放申请，请留意后续模板消息的通知
 * @classification open
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/ad.html
 */
declare const Ad: ComponentType<AdProps>

export { Ad }
