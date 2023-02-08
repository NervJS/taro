import { ComponentType } from 'react'
import { StandardProps } from './common'
interface LoginProps extends StandardProps {
  /** 组件中用户授权按钮的类名，可用于自定义样式
   * @supported swan
   */
  buttonClass?: string

  /** 组件中用户授权勾选框选中时的颜色，同 CSS 的 color
   * @supported swan
   * @default "#3388FF"
   */
  checkedColor?: string

  /** 主题颜色，设置后将应用于 “用户授权按钮背景色” 和 “用户授权勾选框选中时的颜色”
   * 注：theme-color 的优先级低于 button-class 和 checked-color，且当 button-class 存在时，theme-color 不生效
   * @supported swan
   * @default "#3388FF"
   */
  themeColor?: string

  /** 用户完成授权后，获取用户手机号：
   * detail.errMsg 值为"getPhoneNumber:ok" 时代表用户信息获取成功；
   * detail.errMsg 值为"getPhoneNumber:fail auth deny"时代表用户信息获取失败。
   * 参考 用户数据的签名验证和加解密 对用户数据进行处理获得用户手机号。
   * 用户手机号信息解密后数据示例：{"mobile":"15000000000"}
   * 1. 非个人开发者可申请；
   * 2. 审核通过后，进入小程序首页,在左侧导航栏单击“设置 -> 开发设置”。下拉页面，在“获取用户手机号权限申请”中单击“申请开通”
   * @supported swan
   */
  onGetPhoneNumber?: CommonEventFunction

  /** 组件加载失败回调
   * @supported swan
   */
  onLoadError?: CommonEventFunction
}

/** 联合登录 / 手机号授权内嵌组件
 * @classification open
 * @supported swan
 * @see https://smartprogram.baidu.com/docs/develop/component/login/
 */
declare const Login: ComponentType<LoginProps>
export { Login, LoginProps }
