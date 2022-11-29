import { ComponentType } from 'react'
import { StandardProps } from './common'
interface LifestyleProps extends StandardProps {
  /** 必填，生活号 ID（即生活号 APPID），必须是当前小程序同账号主体且已关联的生活号。
   * @supported alipay
   */
  publicId?: string

  /** 文案。支持商家自定义，最多展示一行。
   * @supported alipay
   */
  memo?: string

  /** 当用户关注生活号成功后执行。
   * @supported alipay
   */
  onFollow?: CommonEventFunction
}

/** 关注生活号
 * @classification open
 * @supported alipay
 * @see https://opendocs.alipay.com/mini/component/lifestyle
 */
declare const Lifestyle: ComponentType<LifestyleProps>
export { Lifestyle, LifestyleProps }
