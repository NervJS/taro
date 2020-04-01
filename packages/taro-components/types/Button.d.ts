import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface ButtonProps extends StandardProps {
  /** 按钮的大小
   * @supported weapp, h5, rn
   * @default default
   */
  size?: keyof ButtonProps.size

  /** 按钮的样式类型
   * @supported weapp, h5, rn
   * @default default
   */
  type?: keyof ButtonProps.type

  /** 按钮是否镂空，背景色透明
   * @supported weapp, h5, rn
   * @default false
   */
  plain?: boolean

  /** 是否禁用
   * @supported weapp, h5, rn
   * @default false
   */
  disabled?: boolean

  /** 名称前是否带 loading 图标
   * @supported weapp, h5, rn
   * @default false
   */
  loading?: boolean

  /** 用于 `<form/>` 组件，点击分别会触发 `<form/>` 组件的 submit/reset 事件
   * @supported weapp
   */
  formType?: keyof ButtonProps.formType

  /** 微信开放能力
   * @supported weapp
   */
  openType?: keyof ButtonProps.openType

  /** 指定按下去的样式类。当 `hover-class="none"` 时，没有点击态效果
   * @default button-hover
   * @supported weapp, h5
   * @rn 支持 hoverStyle 属性，但框架未支持 hoverClass
   */
  hoverClass?: string

  /** 由于 RN 不支持 Class，故 RN 端的 Button 组件实现了 `hoverStyle`属性，写法和 style 类似，只不过 `hoverStyle` 的样式是指定按下去的样式。
   * @default none
   * @supported rn
   */
  hoverStyle?: string

  /** 指定是否阻止本节点的祖先节点出现点击态
   * @default false
   * @supported weapp
   */
  hoverStopPropagation?: boolean

  /** 按住后多久出现点击态，单位毫秒
   * @default 20
   * @supported weapp, h5, rn
   */
  hoverStartTime?: number

  /** 手指松开后点击态保留时间，单位毫秒
   * @default 70
   * @supported weapp, h5, rn
   */
  hoverStayTime?: number

  /** 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。
   *
   * 生效时机: `open-type="getUserInfo"`
   * @supported weapp
   */
  lang?: keyof ButtonProps.lang

  /** 会话来源
   *
   * 生效时机：`open-type="contact"`
   * @supported weapp
   */
  sessionFrom?: string

  /** 会话内消息卡片标题
   *
   * 生效时机：`open-type="contact"`
   * @default 当前标题
   * @supported weapp
   */
  sendMessageTitle?: string

  /** 会话内消息卡片点击跳转小程序路径
   *
   * 生效时机：`open-type="contact"`
   * @default 当前标题
   * @supported weapp
   */
  sendMessagePath?: string

  /** 会话内消息卡片图片
   *
   * 生效时机：`open-type="contact"`
   * @default 截图
   * @supported weapp
   */
  sendMessageImg?: string

  /** 打开 APP 时，向 APP 传递的参数
   *
   * 生效时机：`open-type="launchApp"`
   * @supported weapp
   */
  appParameter?: string

  /** 支付宝小程序 scope
   * 
   * 生效时机：`open-type="getAuthorize"`
   * @supported weapp
   */
  scope?: 'userInfo' | 'phoneNumber'

  /** 显示会话内消息卡片
   *
   * 生效时机：`open-type="contact"`
   * @default false
   */
  showMessageCard?: boolean

  /** 用户点击该按钮时，会返回获取到的用户信息，回调的detail数据与 Taro.getUserInfo 返回的一致
   *
   * 生效时机: `open-type="getUserInfo"`
   * @supported weapp
   */
  onGetUserInfo?: CommonEventFunction<ButtonProps.onGetUserInfoEventDetail>

  /** 支付宝获取会员基础信息授权回调
   * 
   * 生效时机：`open-type="getAuthorize"`
   * @supported alipay
   */
  onGetAuthorize?: CommonEventFunction

  /** 客服消息回调
   *
   * 生效时机：`open-type="contact"`
   * @supported weapp
   */
  onContact?: CommonEventFunction<ButtonProps.onContactEventDetail>

  /** 获取用户手机号回调
   *
   * 生效时机：`open-type="getphonenumber"`
   * @supported weapp
   */
  onGetPhoneNumber?: CommonEventFunction<ButtonProps.onGetPhoneNumberEventDetail>

  /** 获取用户实名
   *
   * 生效时机：`open-type="getRealnameAuthInfo"`
   * @supported weapp
   */
  onGetRealnameAuthInfo?: CommonEventFunction

  /** 当使用开放能力时，发生错误的回调
   *
   * 生效时机：`open-type="launchApp"`
   * @supported weapp
   */
  onError?: CommonEventFunction

  /** 在打开授权设置页后回调
   *
   * 生效时机：`open-type="openSetting"`
   * @supported weapp
   */
  onOpenSetting?: CommonEventFunction<ButtonProps.onOpenSettingEventDetail>

  /** 打开 APP 成功的回调
   * 
   * 生效时机：`open-type="launchApp"`
   * @supported weapp
   */
  onLaunchapp?: CommonEventFunction
}

declare namespace ButtonProps {
  /** size 的合法值 */
  interface size {
    /** 默认大小 */
    default
    /** 小尺寸 */
    mini
  }
  /** type 的合法值 */
  interface type {
    /** 绿色 */
    primary
    /** 白色 */
    default
    /** 红色 */
    warn
  }
  /** form-type 的合法值 */
  interface formType {
    /** 提交表单 */
    submit
    /** 重置表单 */
    reset
  }
  /** open-type 的合法值 */
  interface openType {
    /** 打开客服会话，如果用户在会话中点击消息卡片后返回小程序，可以从 bindcontact 回调中获得具体信息
     * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/customer-message/customer-message.html
     */
    contact
    contactShare
    /** 触发用户转发，使用前建议先阅读使用指引
     * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%BC%95
     */
    share
    getRealnameAuthInfo
    getAuthorize
    /** 获取用户手机号，可以从 bindgetphonenumber 回调中获取到用户信息
     * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html
     */
    getPhoneNumber
    /** 获取用户信息，可以从 bindgetuserinfo 回调中获取到用户信息 */
    getUserInfo
    lifestyle
    /** 打开APP，可以通过app-parameter属性设定向APP传的参数
     * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/launchApp.html
     */
    launchApp
    /** 打开授权设置页 */
    openSetting
    /** 打开“意见反馈”页面，用户可提交反馈内容并上传日志，开发者可以登录小程序管理后台后进入左侧菜单“客服反馈”页面获取到反馈内容 */
    feedback
  }
  /** lang 的合法值 */
  interface lang {
    /** 英文 */
    en
    /** 简体中文 */
    zh_CN
    /** 繁体中文 */
    zh_TW
  }

  interface onGetUserInfoEventDetail {
    userInfo: {
      /** 昵称 */
      nickName: string
      /** 头像 */
      avatarUrl: string
      /** 性别 */
      gender: keyof gender
      /** 省份，如：`Yunnan` */
      province: string
      /** 城市，如：`Dalian` */
      city: string
      /** 国家，如：`China` */
      country: string
    }
    /** 不包括敏感信息的原始数据 `JSON` 字符串，用于计算签名 */
    rawData: string
    /** 使用 `sha1(rawData + sessionkey)` 得到字符串，用于校验用户信息 */
    signature: string
    /** 包括敏感数据在内的完整用户信息的加密数据 */
    encryptedData: string
    /** 加密算法的初始向量 */
    iv: string
    /* 用户信息的调用状态 */
    errMsg: string
  }

  /** 性别的合法值 */
  interface gender {
    /** 未知 */
    0
    /** 男 */
    1
    /** 女 */
    2
  }

  interface onContactEventDetail {
    /* 小程序消息的调用状态 */
    errMsg: string
    /** 小程序消息指定的路径 */
    path: string
    /** 小程序消息指定的查询参数 */
    query: Record<string, any>
  }
  
  interface onGetPhoneNumberEventDetail {
    /* 获取用户手机号的调用状态 */
    errMsg: string
    /** 包括敏感数据在内的完整用户信息的加密数据 */
    encryptedData: string
    /** 加密算法的初始向量 */
    iv: string
  }
  
  interface onOpenSettingEventDetail {
    /* 打开授权设置页的调用状态 */
    errMsg: string
    /* 用户授权结果 */
    authSetting: Record<string, boolean>
  }
}

/** 按钮
 * @classification forms
 * @supported weapp, h5, rn
 * @example
 * ```tsx
 * export default class PageButton extends Component {
 *   state = {
 *     btn: [
 *       {
 *         text: '页面主操作 Normal',
 *         size: 'default',
 *         type: 'primary'
 *       },
 *       {
 *         text: '页面主操作 Loading',
 *         size: 'default',
 *         type: 'primary',
 *         loading: true,
 *       },
 *       {
 *         text: '页面主操作 Disabled',
 *         size: 'default',
 *         type: 'primary',
 *         disabled: true,
 *       },
 *       {
 *         text: '页面次要操作 Normal',
 *         size: 'default',
 *         type: 'default'
 *       },
 *       {
 *         text: '页面次要操作 Disabled',
 *         size: 'default',
 *         type: 'default',
 *         disabled: true,
 *       },
 *       {
 *         text: '警告类操作 Normal',
 *         size: 'default',
 *         type: 'warn'
 *       },
 *       {
 *         text: '警告类操作 Disabled',
 *         size: 'default',
 *         type: 'warn',
 *         disabled: true,
 *       }
 *     ]
 *   }
 *   render () {
 *     return (
 *       <View className='container'>
 *         {this.state.btn.map(item => {
 *           return (
 *             <Button
 *               size={item.size ? item.size : ''}
 *               type={item.type ? item.type : ''}
 *               loading={item.loading ? item.loading : false}
 *               disabled={item.disabled ? item.disabled : false}
 *             >
 *               {item.text}
 *             </Button>
 *           )
 *         })}
 *         <Button className='btn-max-w' plain type='primary'>按钮</Button>
 *         <Button className='btn-max-w' plain type='primary' disabled>不可点击的按钮</Button>
 *         <Button className='btn-max-w' plain >按钮</Button>
 *         <Button className='btn-max-w' plain disabled >按钮</Button>
 *         <Button size='mini' type='primary'>按钮</Button>
 *         <Button size='mini' >按钮</Button>
 *         <Button size='mini' type='warn'>按钮</Button>
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/button.html
 */
declare const Button: ComponentType<ButtonProps>

export { Button, ButtonProps }
