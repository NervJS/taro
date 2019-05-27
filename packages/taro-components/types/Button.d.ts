import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

type OpenType = 'contact' | 'share' | 'getUserInfo' | 'getPhoneNumber'


export interface ButtonProps extends StandardProps {

  /**
   * 按钮的大小
   *
   * 默认值：`default`
   */
  size?: 'mini' | 'default',

  /**
   * 按钮的样式类型
   *
   * 默认值：`default`
   */
  type?: 'primary' | 'default' | 'warn',

  /**
   * 按钮是否镂空，背景色透明
   *
   * 默认值：`false`
   */
  plain?: boolean,

  /**
   * 是否禁用
   *
   * 默认值：`false`
   */
  disabled?: boolean,

  /**
   * 名称前是否带 loading 图标
   *
   * 默认值：`false`
   */
  loading?: boolean,

  /**
   * 用于 `<form/>` 组件，点击分别会触发 `<form/>` 组件的 submit/reset 事件
   */
  formType?: 'submit' | 'reset',

  /**
   * 微信开放能力
   */
  openType?: 'contact' | 'share' | 'getUserInfo' | 'getPhoneNumber' | 'launchApp' | 'openSetting' | 'feedback' | 'getRealnameAuthInfo',
  /**
   * 指定按下去的样式类。当 `hover-class="none"` 时，没有点击态效果
   *
   * 默认值：`button-hover`
   */
  hoverClass?: string,

  /**
   * 指定是否阻止本节点的祖先节点出现点击态
   *
   * 默认值：`fasle`
   */
  hoverStopPropagation?: boolean,

  /**
   * 按住后多久出现点击态，单位毫秒
   *
   * 默认值：`20`
   */
  hoverStartTime?: number,

  /**
   * 手指松开后点击态保留时间，单位毫秒
   *
   * 默认值：`70`
   */
  hoverStayTime?: number

  /**
   * 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。
   *
   * 生效时机: `open-type="getUserInfo"`
   */
  lang?: string,

  /**
   * 用户点击该按钮时，会返回获取到的用户信息，回调的detail数据与wx.getUserInfo返回的一致
   *
   * 生效时机: `open-type="getUserInfo"`
   */
  onGetUserInfo?: CommonEventFunction<{
    /** 用户信息 */
    userInfo: {
      /** 昵称 */
      nickName: string,
      /** 头像 */
      avatarUrl: string,
      /**
       * 性别
       *
       * - `0`: 未知
       * - `1`: 男
       * - `2`: 女
       */
      gender: 0 | 1 | 2,
      /** 省份，如：`Yunnan` */
      province: string,
      /** 城市，如：`Dalian` */
      city: string,
      /** 国家，如：`China` */
      country: string,
    },
    /** 不包括敏感信息的原始数据 `JSON` 字符串，用于计算签名 */
    rawData: string,
    /** 使用 `sha1(rawData + sessionkey)` 得到字符串，用于校验用户信息 */
    signature: string,
    /** 包括敏感数据在内的完整用户信息的加密数据 */
    encryptedData: string,
    /** 加密算法的初始向量 */
    iv: string,
  }>,

  /**
   * 会话来源
   *
   * 生效时机：`open-type="contact"`
   */
  sessionFrom?: string,

  /**
   * 会话内消息卡片标题
   *
   * 生效时机：`open-type="contact"`
   *
   * 默认值： 当前标题
   */
  sendMessageTitle?: string,

  /**
   * 会话内消息卡片点击跳转小程序路径
   *
   * 生效时机：`open-type="contact"`
   *
   * 默认值： 当前标题
   */
  sendMessagePath?: string,

  /**
   * 会话内消息卡片图片
   *
   * 生效时机：`open-type="contact"`
   *
   * 默认值： 截图
   */
  sendMessageImg?: string,

  /**
   * 显示会话内消息卡片
   *
   * 生效时机：`open-type="contact"`
   *
   * 默认值： false
   */
  showMessageCard?: boolean,

  /**
   * 客服消息回调
   *
   * 生效时机：`open-type="contact"`
   */
  onContact?: (
    event: {
      /** 小程序消息指定的路径 */
      path: string,
      /** 小程序消息指定的查询参数 */
      query: Record<string, any>
    }
  ) => any,

  /**
   * 获取用户手机号回调
   *
   * 生效时机：`open-type="getphonenumber"`
   */
  onGetPhoneNumber?: CommonEventFunction<{
    /** 包括敏感数据在内的完整用户信息的加密数据 */
    encryptedData: string,
    /** 加密算法的初始向量 */
    iv: string
  }>,

  /**
   * 获取用户实名
   *
   * 生效时机：`open-type="getRealnameAuthInfo"`
   */
  onGetRealnameAuthInfo?: CommonEventFunction,

  /**
   * 打开 APP 时，向 APP 传递的参数
   *
   * 生效时机：`open-type="launchApp"`
   */
  appParameter?: string,
  /**
   * 当使用开放能力时，发生错误的回调
   *
   * 生效时机：`open-type="launchApp"`
   */
  onError?: CommonEventFunction,

  /**
   * 在打开授权设置页后回调
   *
   * 生效时机：`open-type="openSetting"`
   */
  onOpenSetting?: CommonEventFunction
}

declare const Button: ComponentType<ButtonProps>

export { Button }
