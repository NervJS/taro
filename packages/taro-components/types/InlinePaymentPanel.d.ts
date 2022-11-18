import { ComponentType } from 'react'
import { StandardProps } from './common'
interface InlinePaymentPanelProps extends StandardProps {
  /** 总金额，金额单位分，tip：仅支持整数型字符串
   * @supported swan
   */
  totalAmount?: string

  /** 百度收银台的财务结算凭证，详见平台术语
   * @supported swan
   */
  dealId?: string

  /** 支付能力开通后分配的支付 appKey，详见平台术语
   * @supported swan
   */
  appKey?: string

  /** 平台营销信息，此处传当前订单中可使用平台券的 spuid，同时需在 支付能力中搭配使用传入该参数；注：仅与百度合作平台类目券的开发者需要填写该参数
   * @supported swan
   */
  promotionTag?: string | Array<string>

  /** 是否设置挽留弹窗
   * @supported swan
   * @default false
   */
  enablePageBackModal?: boolean

  /** 自定义样式设置
   * @supported swan
   */
  customStyle?: string

  /** 自定义样式档位配置，各档位配置项包括支付渠道/优惠券条高度、渠道图标大小、支付渠道文案字体大小、营销文案字体大小、选择器图标大小
   * @supported swan
   * @default "default"
   */
  styleType?: 'tiny' | 'small' | 'default' | 'medium' | 'large'

  /** 获取支付相关信息，具体信息在返回值的 detail 字段中
   * @supported swan
   */
  onGetPaymentInfo?: CommonEventFunction

  /** 当发生错误时触发 error 事件，具体信息在返回值的 detail 字段中，例如 {detail: {errMsg: "something is wrong"}}
   * @supported swan
   */
  onError?: CommonEventFunction
}

/** 内嵌支付组件
 * @classification open
 * @supported swan
 * @see https://smartprogram.baidu.com/docs/develop/component/inline_payment_panel/
 */
declare const InlinePaymentPanel: ComponentType<InlinePaymentPanelProps>
export { InlinePaymentPanel, InlinePaymentPanelProps }
