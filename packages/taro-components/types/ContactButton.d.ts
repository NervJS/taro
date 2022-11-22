import { ComponentType } from 'react'
import { StandardProps } from './common'
interface ContactButtonProps extends StandardProps {
  /** 必填。企业唯一编码，一个企业支付宝账号对应一个编码。
   * @supported alipay
   */
  tntInstId: string

  /** 必填。聊天窗编码，每个聊天窗的唯一编码。
   * @supported alipay
   */
  scene: string

  /** 选填。咨询按钮大小，正方形设置边长（如25*25 px）。
   * @supported alipay
   * @default 25
   */
  size?: number | string

  /** 选填。咨询按钮颜色，默认白底蓝色。
   * @supported alipay
   * @default "#00A3FF"
   */
  color?: string

  /** 选填。咨询按钮头像。
   * @supported alipay
   */
  icon?: string

  /** 选填。支付宝访客用户ID（2088开头）。
   * 说明： 客服回答问题时，如客户已离开咨询窗口，则通过推送消息到支付宝 card 中提醒客户。
   * @supported alipay
   */
  alipayCardNo?: string

  /** 选填。该属性主要用于传递一些扩展信息给组件，以实现一些高级功能。该属性值的生成方式为：encodeURIComponent({"字段名":"字段值"})， 其中，字段名和字段值要根据实际使用的功能进行替换。
   * 目前通过传入扩展信息可支持的 3 个功能：
   * 1.访客名片。需传 cinfo 和 key 两个扩展字段，代码形如在云客服中进入 设置 > 服务窗配置 > 聊天窗 URL。点击操作栏中的 聊天窗 URL ，获取 tntInstId（企业编码）和 scene（聊天窗编码）。encodeURIComponent({"cinfo":"生成的 cinfo","key":"生成的key"})，cinfo 和 key 的值说明 支付宝小程序接入访客名片；
   * 2.聊天窗默认带出用户的小程序订单数据。需传 appId 字段，代码形如encodeURIComponent({"appId":"商户小程序appid"})
   * 3.未读客服消息同步至"我的小程序-我的"。同样需传 appId 字段，代码形如 encodeURIComponent({"appId":"商户小程序appid"})。
   * @supported alipay
   */
  extInfo?: string
}

/** 智能客服
 * @classification open
 * @supported alipay
 * @see https://opendocs.alipay.com/mini/component/contact-button
 */
declare const ContactButton: ComponentType<ContactButtonProps>
export { ContactButton, ContactButtonProps }
