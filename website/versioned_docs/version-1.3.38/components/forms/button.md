---
title: Button
sidebar_label: Button
id: version-1.3.38-button
original_id: button
---

按钮

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/button.html)

## 类型

```tsx
ComponentType<ButtonProps>
```

## 示例代码

```tsx
export default class PageButton extends Component {
  state = {
    btn: [
      {
        text: '页面主操作 Normal',
        size: 'default',
        type: 'primary'
      },
      {
        text: '页面主操作 Loading',
        size: 'default',
        type: 'primary',
        loading: true,
      },
      {
        text: '页面主操作 Disabled',
        size: 'default',
        type: 'primary',
        disabled: true,
      },
      {
        text: '页面次要操作 Normal',
        size: 'default',
        type: 'default'
      },
      {
        text: '页面次要操作 Disabled',
        size: 'default',
        type: 'default',
        disabled: true,
      },
      {
        text: '警告类操作 Normal',
        size: 'default',
        type: 'warn'
      },
      {
        text: '警告类操作 Disabled',
        size: 'default',
        type: 'warn',
        disabled: true,
      }
    ]
  }
  render () {
    return (
      <View className='container'>
        {this.state.btn.map(item => {
          return (
            <Button
              size={item.size ? item.size : ''}
              type={item.type ? item.type : ''}
              loading={item.loading ? item.loading : false}
              disabled={item.disabled ? item.disabled : false}
            >
              {item.text}
            </Button>
          )
        })}
        <Button className='btn-max-w' plain type='primary'>按钮</Button>
        <Button className='btn-max-w' plain type='primary' disabled>不可点击的按钮</Button>
        <Button className='btn-max-w' plain >按钮</Button>
        <Button className='btn-max-w' plain disabled >按钮</Button>
        <Button size='mini' type='primary'>按钮</Button>
        <Button size='mini' >按钮</Button>
        <Button size='mini' type='warn'>按钮</Button>
      </View>
    )
  }
}
```

## ButtonProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| size | "default" or "mini" | `default` | 否 | 按钮的大小 |
| type | "default" or "primary" or "warn" | `default` | 否 | 按钮的样式类型 |
| plain | `boolean` | `false` | 否 | 按钮是否镂空，背景色透明 |
| disabled | `boolean` | `false` | 否 | 是否禁用 |
| loading | `boolean` | `false` | 否 | 名称前是否带 loading 图标 |
| formType | "submit" or "reset" |  | 否 | 用于 `<form/>` 组件，点击分别会触发 `<form/>` 组件的 submit/reset 事件 |
| openType | "contact" or "contactShare" or "share" or "getRealnameAuthInfo" or "getAuthorize" or "getPhoneNumber" or "getUserInfo" or "lifestyle" or "launchApp" or "openSetting" or "feedback" |  | 否 | 微信开放能力 |
| hoverClass | `string` | `button-hover` | 否 | 指定按下去的样式类。当 `hover-class="none"` 时，没有点击态效果 |
| hoverStyle | `string` | `none` | 否 | 由于 RN 不支持 Class，故 RN 端的 Button 组件实现了 `hoverStyle`属性，写法和 style 类似，只不过 `hoverStyle` 的样式是指定按下去的样式。 |
| hoverStopPropagation | `boolean` | `false` | 否 | 指定是否阻止本节点的祖先节点出现点击态 |
| hoverStartTime | `number` | `20` | 否 | 按住后多久出现点击态，单位毫秒 |
| hoverStayTime | `number` | `70` | 否 | 手指松开后点击态保留时间，单位毫秒 |
| lang | "en" or "zh_CN" or "zh_TW" |  | 否 | 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。<br /><br />生效时机: `open-type="getUserInfo"` |
| sessionFrom | `string` |  | 否 | 会话来源<br /><br />生效时机：`open-type="contact"` |
| sendMessageTitle | `string` | `当前标题` | 否 | 会话内消息卡片标题<br /><br />生效时机：`open-type="contact"` |
| sendMessagePath | `string` | `当前标题` | 否 | 会话内消息卡片点击跳转小程序路径<br /><br />生效时机：`open-type="contact"` |
| sendMessageImg | `string` | `截图` | 否 | 会话内消息卡片图片<br /><br />生效时机：`open-type="contact"` |
| appParameter | `string` |  | 否 | 打开 APP 时，向 APP 传递的参数<br /><br />生效时机：`open-type="launchApp"` |
| scope | "userInfo" or "phoneNumber" |  | 否 | 支付宝小程序 scope<br /><br />生效时机：`open-type="getAuthorize"` |
| showMessageCard | `boolean` | `false` | 否 | 显示会话内消息卡片<br /><br />生效时机：`open-type="contact"` |
| onGetUserInfo | `BaseEventOrigFunction<onGetUserInfoEventDetail>` |  | 否 | 用户点击该按钮时，会返回获取到的用户信息，回调的detail数据与 Taro.getUserInfo 返回的一致<br /><br />生效时机: `open-type="getUserInfo"` |
| onGetAuthorize | `BaseEventOrigFunction<any>` |  | 否 | 支付宝获取会员基础信息授权回调<br /><br />生效时机：`open-type="getAuthorize"` |
| onContact | `BaseEventOrigFunction<onContactEventDetail>` |  | 否 | 客服消息回调<br /><br />生效时机：`open-type="contact"` |
| onGetPhoneNumber | `BaseEventOrigFunction<onGetPhoneNumberEventDetail>` |  | 否 | 获取用户手机号回调<br /><br />生效时机：`open-type="getphonenumber"` |
| onGetRealnameAuthInfo | `BaseEventOrigFunction<any>` |  | 否 | 获取用户实名<br /><br />生效时机：`open-type="getRealnameAuthInfo"` |
| onError | `BaseEventOrigFunction<any>` |  | 否 | 当使用开放能力时，发生错误的回调<br /><br />生效时机：`open-type="launchApp"` |
| onOpenSetting | `BaseEventOrigFunction<onOpenSettingEventDetail>` |  | 否 | 在打开授权设置页后回调<br /><br />生效时机：`open-type="openSetting"` |
| onLaunchapp | `BaseEventOrigFunction<any>` |  | 否 | 打开 APP 成功的回调<br /><br />生效时机：`open-type="launchApp"` |

### API 支持度

| API | 微信小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: |
| ButtonProps.size | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.type | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.plain | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.disabled | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.loading | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.formType | ✔️ |  |  |  |
| ButtonProps.openType | ✔️ |  |  |  |
| ButtonProps.hoverClass | ✔️ |  | ✔️ | (支持 hoverStyle 属性，但框架未支持 hoverClass) |
| ButtonProps.hoverStyle |  |  |  | ✔️ |
| ButtonProps.hoverStopPropagation | ✔️ |  |  |  |
| ButtonProps.hoverStartTime | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.hoverStayTime | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.lang | ✔️ |  |  |  |
| ButtonProps.sessionFrom | ✔️ |  |  |  |
| ButtonProps.sendMessageTitle | ✔️ |  |  |  |
| ButtonProps.sendMessagePath | ✔️ |  |  |  |
| ButtonProps.sendMessageImg | ✔️ |  |  |  |
| ButtonProps.appParameter | ✔️ |  |  |  |
| ButtonProps.scope | ✔️ |  |  |  |
| ButtonProps.onGetUserInfo | ✔️ |  |  |  |
| ButtonProps.onGetAuthorize |  | ✔️ |  |  |
| ButtonProps.onContact | ✔️ |  |  |  |
| ButtonProps.onGetPhoneNumber | ✔️ |  |  |  |
| ButtonProps.onGetRealnameAuthInfo | ✔️ |  |  |  |
| ButtonProps.onError | ✔️ |  |  |  |
| ButtonProps.onOpenSetting | ✔️ |  |  |  |
| ButtonProps.onLaunchapp | ✔️ |  |  |  |

### size

size 的合法值

| 参数 | 说明 |
| --- | --- |
| default | 默认大小 |
| mini | 小尺寸 |

### type

type 的合法值

| 参数 | 说明 |
| --- | --- |
| primary | 绿色 |
| default | 白色 |
| warn | 红色 |

### formType

form-type 的合法值

| 参数 | 说明 |
| --- | --- |
| submit | 提交表单 |
| reset | 重置表单 |

### openType

open-type 的合法值

| 参数 | 说明 |
| --- | --- |
| contact | 打开客服会话，如果用户在会话中点击消息卡片后返回小程序，可以从 bindcontact 回调中获得具体信息<br />[参考地址](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/customer-message/customer-message.html) |
| contactShare |  |
| share | 触发用户转发，使用前建议先阅读使用指引<br />[参考地址](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%BC%95) |
| getRealnameAuthInfo |  |
| getAuthorize |  |
| getPhoneNumber | 获取用户手机号，可以从 bindgetphonenumber 回调中获取到用户信息<br />[参考地址](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html) |
| getUserInfo | 获取用户信息，可以从 bindgetuserinfo 回调中获取到用户信息 |
| lifestyle |  |
| launchApp | 打开APP，可以通过app-parameter属性设定向APP传的参数<br />[参考地址](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/launchApp.html) |
| openSetting | 打开授权设置页 |
| feedback | 打开“意见反馈”页面，用户可提交反馈内容并上传日志，开发者可以登录小程序管理后台后进入左侧菜单“客服反馈”页面获取到反馈内容 |

### lang

lang 的合法值

| 参数 | 说明 |
| --- | --- |
| en | 英文 |
| zh_CN | 简体中文 |
| zh_TW | 繁体中文 |

### onGetUserInfoEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| userInfo | { nickName: string; avatarUrl: string; gender: 0 or 1 or 2; province: string; city: string; country: string; } |  |
| rawData | `string` | 不包括敏感信息的原始数据 `JSON` 字符串，用于计算签名 |
| signature | `string` | 使用 `sha1(rawData + sessionkey)` 得到字符串，用于校验用户信息 |
| encryptedData | `string` | 包括敏感数据在内的完整用户信息的加密数据 |
| iv | `string` | 加密算法的初始向量 |
| errMsg | `string` |  |

### gender

性别的合法值

| 参数 | 说明 |
| --- | --- |
| 0 | 未知 |
| 1 | 男 |
| 2 | 女 |

### onContactEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` |  |
| path | `string` | 小程序消息指定的路径 |
| query | `Record<string, any>` | 小程序消息指定的查询参数 |

### onGetPhoneNumberEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` |  |
| encryptedData | `string` | 包括敏感数据在内的完整用户信息的加密数据 |
| iv | `string` | 加密算法的初始向量 |

### onOpenSettingEventDetail

| 参数 | 类型 |
| --- | --- |
| errMsg | `string` |
| authSetting | `Record<string, boolean>` |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Button | ✔️ | ✔️ | ✔️ |
