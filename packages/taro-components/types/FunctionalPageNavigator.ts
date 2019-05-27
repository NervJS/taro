import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

/**
 * 这个组件从小程序基础库版本 2.1.0 开始支持。
 * 仅在插件的自定义组件中有效，用于跳转到插件功能页。
 * @since 2.1.0
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/component/functional-page-navigator.html}
 */
export interface FunctionalPageNavigatorProps extends StandardProps {

  /**
   * 跳转到的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版）；线上版本必须设置为 release
   * 默认值：`release`
   */
  version: string,

  /**
   * 要跳转到的功能页
   * 目前支持的功能页和name 有效值：
   * loginAndGetUserInfo|[用户信息功能页](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages/user-info.html)
   * requestPayment|[支付功能页](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages/request-payment.html)
   */
  name: 'loginAndGetUserInfo' | 'requestPayment',

  /**
   * 功能页参数，参数格式与具体功能页相关
   * 默认值：`null`
   */
  args: object,

  /**
   * 功能页返回，且操作成功时触发， detail 格式与具体功能页相关
   */
  onSuccess?: CommonEventFunction,

  /**
   * 功能页返回，且操作失败时触发， detail 格式与具体功能页相关
   */
  onFail?: CommonEventFunction
}

declare const FunctionalPageNavigator: ComponentType<FunctionalPageNavigatorProps>

export { FunctionalPageNavigator }
