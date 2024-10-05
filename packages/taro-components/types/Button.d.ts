import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
import { StyleProp, ViewStyle } from 'react-native'
interface ButtonProps extends StandardProps {
  /** 按钮的大小
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   * @default default
   */
  size?: keyof ButtonProps.Size
  /** 按钮的样式类型
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   * @default default
   */
  type?: keyof ButtonProps.Type
  /** 按钮是否镂空，背景色透明
   * @supported weapp, alipay, swan, qq, jd, h5, rn, harmony_hybrid
   * @default false
   */
  plain?: boolean
  /** 是否禁用
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   * @default false
   */
  disabled?: boolean
  /** 名称前是否带 loading 图标
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   * @default false
   */
  loading?: boolean
  /** 用于 `<form/>` 组件，点击分别会触发 `<form/>` 组件的 submit/reset 事件
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  formType?: keyof ButtonProps.FormType
  /** 微信开放能力
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  openType?: ButtonProps.OpenType
  /** 指定按下去的样式类。当 `hover-class="none"` 时，没有点击态效果
   * @default button-hover
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   * @rn 支持 hoverStyle 属性，但框架未支持 hoverClass
   */
  hoverClass?: string
  /** 由于 RN 不支持 hoverClass，故 RN 端的 Button 组件实现了 `hoverStyle`属性，写法和 style 类似，只不过 `hoverStyle` 的样式是指定按下去的样式。
   * @default none
   * @supported rn
   */
  hoverStyle?: StyleProp<ViewStyle>
  /** 指定是否阻止本节点的祖先节点出现点击态
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  hoverStopPropagation?: boolean
  /** 按住后多久出现点击态，单位毫秒
   * @default 20
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  hoverStartTime?: number
  /** 手指松开后点击态保留时间，单位毫秒
   * @default 70
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  hoverStayTime?: number
  /** 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。
   *
   * 生效时机: `open-type="getUserInfo"`
   * @supported weapp, qq, jd
   */
  lang?: keyof ButtonProps.Lang
  /** 会话来源
   *
   * 生效时机：`open-type="contact"`
   * @supported weapp, swan
   */
  sessionFrom?: string
  /** 会话内消息卡片标题
   *
   * 生效时机：`open-type="contact"`
   * @default 当前标题
   * @supported weapp, swan
   */
  sendMessageTitle?: string
  /** 会话内消息卡片点击跳转小程序路径
   *
   * 生效时机：`open-type="contact"`
   * @default 当前标题
   * @supported weapp, swan
   */
  sendMessagePath?: string
  /** 会话内消息卡片图片
   *
   * 生效时机：`open-type="contact"`
   * @default 截图
   * @supported weapp, swan
   */
  sendMessageImg?: string
  /** 打开 APP 时，向 APP 传递的参数
   *
   * 生效时机：`open-type="launchApp"`
   * @supported weapp, qq, jd
   */
  appParameter?: string
  /** 支付宝小程序 scope
   *
   * 生效时机：`open-type="getAuthorize"`
   * @supported alipay
   */
  scope?: 'userInfo' | 'phoneNumber'
  /** 显示会话内消息卡片
   *
   * 生效时机：`open-type="contact"`
   * @supported weapp, swan
   * @default false
   */
  showMessageCard?: boolean
  /** 生活号 id，必须是当前小程序同主体且已关联的生活号，open-type="lifestyle" 时有效。
   * @supported alipay, qq
   */
  publicId?: string
  /** 发送订阅类模板消息所用的模板库标题 ID ，可通过 getTemplateLibraryList 获取
   * 当参数类型为 Array 时，可传递 1~3 个模板库标题 ID
   * @supported swan
   */
  templateId?: string | Array<string>
  /** 发送订阅类模板消息时所使用的唯一标识符，内容由开发者自定义，用来标识订阅场景
   * 注意：同一用户在同一 subscribe-id 下的多次授权不累积下发权限，只能下发一条。若要订阅多条，需要不同 subscribe-id
   * @supported swan
   */
  subscribeId?: string
  /** 群聊 id
   * @qq 打开群资料卡时，传递的群号
   * @tt 通过创建聊天群、查询群信息获取
   * @supported qq
   */
  groupId?: string
  /** 打开频道页面时，传递的频道号
   * @supported qq
   */
  guildId?: string
  /** 分享类型集合，请参考下面share-type有效值说明。share-type后续将不再维护，请更新为share-mode
   * @supported qq
   * @default 27
   */
  shareType?: string
  /** 分享类型集合，请参考下面share-mode有效值说明
   * @supported qq
   * @default ['qq', 'qzone']
   */
  shareMode?: string
  /** 无障碍访问，（属性）元素的额外描述
   * @supported qq
   */
  ariaLabel?: string
  /** 添加好友时，对方的 openid
   * @supported qq
   */
  openId?: string
  /** 发送对象的 FriendInfo
   * @supported qq
   */
  shareMessageFriendInfo?: string
  /** 转发标题，不传则默认使用当前小程序的昵称。 FriendInfo
   * @supported qq
   */
  shareMessageTitle?: string
  /** 转发显示图片的链接，可以是网络图片路径（仅 QQ CDN 域名路径）或本地图片文件路径或相对代码包根目录的图片文件路径。显示图片长宽比是 5:4FriendInfo
   * @supported qq
   */
  shareMessageImg?: string
  /** 用户点击该按钮时，会返回获取到的用户信息，回调的detail数据与 Taro.getUserInfo 返回的一致
   *
   * 生效时机: `open-type="getUserInfo"`
   * @supported weapp, alipay, swan, qq, jd
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
   * @supported weapp, swan, qq
   */
  onContact?: CommonEventFunction<ButtonProps.onContactEventDetail>
  /** 获取用户手机号回调
   *
   * 生效时机：`open-type="getPhoneNumber"`
   * @supported weapp, alipay, swan, tt, jd
   */
  onGetPhoneNumber?: CommonEventFunction<ButtonProps.onGetPhoneNumberEventDetail>
  /** 当使用开放能力时，发生错误的回调
   *
   * 生效时机：`open-type="launchApp"`
   * @supported weapp, alipay, qq, jd
   */
  onError?: CommonEventFunction
  /** 在打开授权设置页后回调
   *
   * 生效时机：`open-type="openSetting"`
   * @supported weapp, swan, tt, qq, jd
   */
  onOpenSetting?: CommonEventFunction<ButtonProps.onOpenSettingEventDetail>
  /** 打开 APP 成功的回调
   *
   * 生效时机：`open-type="launchApp"`
   * @supported weapp, qq
   */
  onLaunchApp?: CommonEventFunction
  /** 获取用户头像回调
   *
   * 生效时机：`open-type="chooseAvatar"`
   * @supported weapp
   */
  onChooseAvatar?: CommonEventFunction
  /** 点击。
   * 说明： 每点击一次会触发一次事件，建议自行使用代码防止重复点击,可以使用 js 防抖和节流实现。
   * @supported alipay
   */
  onTap?: CommonEventFunction
  /** 当 open-type 为 lifestyle 时有效。
   * 当点击按钮时触发。
   * event.detail = { followStatus }，followStatus 合法值有 1、2、3，其中 1 表示已关注。2 表示用户不允许关注。3 表示发生未知错误；
   * 已知问题：基础库 1.0，当用户在点击按钮前已关注生活号，event.detail.followStatus 的值为 true。
   * @supported alipay
   */
  onFollowLifestyle?: CommonEventFunction<{
    followStatus: 1 | 2 | 3 | true
  }>
  /** 用户点击该按钮时，调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址，从返回参数的 detail 中获取，和 swan.chooseAddress 一样的。和 open-type 搭配使用，使用时机：open-type="chooseAddress"
   * @supported swan
   */
  onChooseAddress?: CommonEventFunction
  /** 用户点击该按钮时，选择用户的发票抬头，和 swan.chooseInvoiceTitle 一样的。和 open-type 搭配使用，使用时机：open-type="chooseInvoiceTitle"
   * @supported swan
   */
  onChooseInvoiceTitle?: CommonEventFunction
  /** 登录回调，和 open-type 搭配使用，使用时机：open-type="login"。可以通过返回参数的 detail 判断是否登录成功，当 errMsg 为'login:ok'时即为成功。如想获取登录凭证请使用 swan.getLoginCode
   * @supported swan
   */
  onLogin?: CommonEventFunction
  /** 订阅消息授权回调，和 open-type 搭配使用，使用时机：open-type="subscribe"
   * @supported swan
   */
  onSubscribe?: CommonEventFunction
  /** 添加好友的回调
   * @supported qq
   */
  onAddFriend?: CommonEventFunction
  /** 添加群应用的回调。errCode 错误码：41004（当前用户非管理员或群主，无权操作），41005（超过可添加群应用的群数量）
   * @supported qq
   */
  onAddGroupApp?: CommonEventFunction
}
declare namespace ButtonProps {
  /** size 的合法值 */
  interface Size {
    /** 默认大小 */
    default
    /** 小尺寸 */
    mini
  }
  /** type 的合法值 */
  interface Type {
    /** 绿色 */
    primary
    /** 白色 */
    default
    /** 红色 */
    warn
  }
  /** form-type 的合法值 */
  interface FormType {
    /** 提交表单 */
    submit
    /** 重置表单 */
    reset
  }
  /** open-type 的合法值 */
  type OpenType =
    | keyof openTypeKeys['weapp']
    | keyof openTypeKeys['alipay']
    | keyof openTypeKeys['qq']
    | keyof openTypeKeys['tt']
  /** open-type 的合法值 */
  interface openTypeKeys {
    weapp: {
      /** 打开客服会话，如果用户在会话中点击消息卡片后返回小程序，可以从回调中获得具体信息
       * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/customer-message/customer-message.html
       */
      contact
      /** 触发用户转发，使用前建议先阅读使用指引
       * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%BC%95
       */
      share
      /** 获取用户手机号，可以从回调中获取到用户信息
       * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html
       */
      getPhoneNumber
      /**
       * 手机号实时验证，向用户申请，并在用户同意后，快速填写和实时验证手机号。（*小程序插件中不能使用*）
       * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getRealtimePhoneNumber.html
       */
      getRealtimePhoneNumber
      /** 获取用户信息，可以从回调中获取到用户信息 */
      getUserInfo
      /** 打开APP，可以通过 app-parameter 属性设定向APP传的参数
       * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/launchApp.html
       */
      launchApp
      /** 打开授权设置页 */
      openSetting
      /** 打开“意见反馈”页面，用户可提交反馈内容并上传日志，开发者可以登录小程序管理后台后进入左侧菜单“客服反馈”页面获取到反馈内容 */
      feedback
      /** 获取用户头像，可以从回调中获得具体信息 */
      chooseAvatar
      /**
       * 用户同意隐私协议按钮。可通过 bindagreeprivacyauthorization 监听用户同意隐私协议事件
       */
      agreePrivacyAuthorization
      /**
       * 从基础库 2.32.3 版本起，隐私同意按钮支持与手机号快速验证组件耦合使用，调用方式为：
       * <button open-type="getPhoneNumber|agreePrivacyAuthorization">
       */
      ['getPhoneNumber|agreePrivacyAuthorization']
      /**
       * 从基础库 2.32.3 版本起，支持隐私同意按钮与手机号实时验证组件耦合使用，调用方式为：
       * <button open-type="getRealtimePhoneNumber|agreePrivacyAuthorization">
       */
      ['getRealtimePhoneNumber|agreePrivacyAuthorization']
      /**
       * 从基础库 2.32.3 版本起，支持隐私同意按钮与获取用户信息组件耦合使用，调用方式为：
       * <button open-type="getUserInfo|agreePrivacyAuthorization">
       */
      ['getUserInfo|agreePrivacyAuthorization']
    }
    /** 支付宝小程序专属的 open-type 合法值
     * @see https://opendocs.alipay.com/mini/component/button
     */
    alipay: {
      /** 触发 自定义分享 */
      share
      /** 支持小程序授权 */
      getAuthorize
      /** 分享到通讯录好友 */
      contactShare
      /** 关注生活号 */
      lifestyle
    }
    /** QQ 小程序专属的 open-type 合法值
     * @see https://q.qq.com/wiki/develop/miniprogram/component/form/button.html
     */
    qq: {
      /** 触发用户转发，使用前建议先阅读使用指引
       * @see https://q.qq.com/wiki/develop/miniprogram/frame/open_ability/open_share.html#%E8%BD%AC%E5%8F%91-2
       */
      share
      /** 获取用户信息，可以从 onGetUserInfo 回调中获取到用户信息 */
      getUserInfo
      /** 打开APP，可以通过 app-parameter 属性设定向APP传的参数
       * @see https://q.qq.com/wiki/develop/miniprogram/frame/open_ability/open_app.html
       */
      launchApp
      /** 打开授权设置页 */
      openSetting
      /** 呼起吐个槽反馈页面，开发者可以到官网查看反馈 */
      feedback
      /** 呼起群资料卡页面，可以通过 group-id 属性设定需要打开的群资料卡的群号，同时 app.json 中必须配置 groupIdList（数量不超过 10 个），表明可以打开群资料卡的群号 */
      openGroupProfile
      /** 添加好友，对方需要通过该小程序进行授权，允许被加好友后才能调用成功[用户授权](https://q.qq.com/wiki/develop/miniprogram/frame/open_ability/open_userinfo.html#%E6%8E%88%E6%9D%83) */
      addFriend
      /** 添加彩签，点击后添加状态有用户提示，无回调 */
      addColorSign
      /** 打开公众号资料卡，可以通过 public-id 属性设定需要打开的公众号资料卡的号码，同时 app.json 中必须配置 publicIdList（目前只能配置 1 个），表明可以打开的公众号资料卡的号码 */
      openPublicProfile
      /** 添加群应用（只有管理员或群主有权操作，建议先调用 qq.getGroupInfo 获取当前用户是否为管理员，如果是管理员才显示该按钮），添加后给button绑定 onAddGroupApp 事件接收回调数据。 */
      addGroupApp
      /** 在自定义开放数据域组件中,向指定好友发起分享据 */
      shareMessageToFriend
    }
    /** TT 小程序专属的 open-type 合法值
     * @see https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/develop/component/list/button/#open-type-%E7%9A%84%E5%90%88%E6%B3%95%E5%80%BC
     */
    tt: {
      /** 触发用户转发, 可以配合 data-channel 属性来设置分享的 channel，具体请参考 ShareParam */
      share
      /** 获取用户手机号，可以从 bindgetphonenumber 回调中获取到用户信息，详情请参见获取手机号 */
      getPhoneNumber
      /** 跳转到抖音IM客服，详情请参见抖音IM客服能力 */
      im
      /** 跳转到抖音平台客服，详情请参见平台客服能力 */
      platformIm
      /** 跳转视频播放页，详情请参见跳转视频播放页 */
      navigateToVideoView
      /** 跳转抖音号个人页，详情请参见跳转抖音号个人页 */
      openAwemeUserProfile
      /** 跳转抖音直播间，详情请参见跳转抖音直播间 */
      openWebcastRoom
      /** 写入系统日历，详情请参见写入系统日历 */
      addCalendarEvent
      /** 添加到桌面，详情请参见添加到桌面 */
      addShortcut
      /** 加群，详情请参见加群 */
      joinGroup
      /** 私信，详情请参见私信 */
      privateMessage
      /** 主动授权私信，详情请参见主动授权私信 */
      authorizePrivateMessage
    }
  }
  /** lang 的合法值 */
  interface Lang {
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
      /** 头像链接 */
      avatarUrl: string
      /** 头像
       * @supported alipay
       */
      avatar: string
      /** 性别 */
      gender: keyof Gender
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
    /** 敏感数据对应的云 ID，开通[云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)的小程序才会返回，可通过云调用直接获取开放数据，详细见[云调用直接获取开放数据](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#method-cloud) */
    cloudID?: string
  }
  /** 性别的合法值 */
  interface Gender {
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
    /** 动态令牌。可通过动态令牌换取用户手机号。
     * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%BC%95
     */
    code?: string
    /**
     * 签名信息，如果在开放平台后台配置了加签方式后有此字段
     * @supported alipay
     */
    sign: string
  }
  interface onGetRealTimePhoneNumberEventDetail {
    code: string
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
 * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony, harmony_hybrid
 * @example_react
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
 *         <Button openType='getPhoneNumber' onGetPhoneNumber="callback">按钮</Button>
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <view class="container">
 *     <button
 *       v-for="item in btn"
 *       :size="item.size ? item.size : ''"
 *       :type="item.type ? item.type : ''"
 *       :loading="item.loading ? item.loading : false"
 *       :disabled="item.disabled ? item.disabled : false"
 *     >
 *       {{ item.text }}
 *     </button>
 *     <button class="btn-max-w" :plain="true" type="primary">按钮</button>
 *     <button class="btn-max-w" :plain="true" type="primary" :disabled="true">不可点击的按钮</button>
 *     <button class="btn-max-w" :plain="true">按钮</button>
 *     <button class="btn-max-w" :plain="true" :disabled="true">按钮</button>
 *     <button size="mini" type="primary">按钮</button>
 *     <button size="mini" >按钮</button>
 *     <button size="mini" type="warn">按钮</button>
 *     <button open-type="getPhoneNumber" `@getphonenumber="callback">按钮</button>
 *   </view>
 * </template>
 *
 * <script>
 * export default {
 *   data() {
 *     return {
 *       btn: [
 *         {
 *           text: '页面主操作 Normal',
 *           size: 'default',
 *           type: 'primary'
 *         },
 *         {
 *           text: '页面主操作 Loading',
 *           size: 'default',
 *           type: 'primary',
 *           loading: true,
 *         },
 *         {
 *           text: '页面主操作 Disabled',
 *           size: 'default',
 *           type: 'primary',
 *           disabled: true,
 *         },
 *         {
 *           text: '页面次要操作 Normal',
 *           size: 'default',
 *           type: 'default'
 *         },
 *         {
 *           text: '页面次要操作 Disabled',
 *           size: 'default',
 *           type: 'default',
 *           disabled: true,
 *         },
 *         {
 *           text: '警告类操作 Normal',
 *           size: 'default',
 *           type: 'warn'
 *         },
 *         {
 *           text: '警告类操作 Disabled',
 *           size: 'default',
 *           type: 'warn',
 *           disabled: true,
 *         }
 *       ]
 *     }
 *   }
 * }
 * </script>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/button.html
 */
declare const Button: ComponentType<ButtonProps>
export { Button, ButtonProps }
