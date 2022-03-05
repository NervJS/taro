---
title: Button
sidebar_label: Button
---

按钮

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/button.html)

## 类型

```tsx
ComponentType<ButtonProps>
```

## 示例代码

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

<Tabs
  defaultValue="React"
  values={[
  {
    "label": "React",
    "value": "React"
  },
  {
    "label": "Vue",
    "value": "Vue"
  }
]}>
<TabItem value="React">

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
</TabItem>
<TabItem value="Vue">

```html
<template>
  <view class="container">
    <button
      v-for="item in btn"
      :size="item.size ? item.size : ''"
      :type="item.type ? item.type : ''"
      :loading="item.loading ? item.loading : false"
      :disabled="item.disabled ? item.disabled : false"
    >
      {{ item.text }}
    </button>
    <button class="btn-max-w" :plain="true" type="primary">按钮</button>
    <button class="btn-max-w" :plain="true" type="primary" :disabled="true">不可点击的按钮</button>
    <button class="btn-max-w" :plain="true">按钮</button>
    <button class="btn-max-w" :plain="true" :disabled="true">按钮</button>
    <button size="mini" type="primary">按钮</button>
    <button size="mini" >按钮</button>
    <button size="mini" type="warn">按钮</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
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
  }
}
</script>
```
</TabItem>
</Tabs>

## ButtonProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| size | `keyof Size` | `default` | 否 | 按钮的大小 |
| type | `keyof Type` | `default` | 否 | 按钮的样式类型 |
| plain | `boolean` | `false` | 否 | 按钮是否镂空，背景色透明 |
| disabled | `boolean` | `false` | 否 | 是否禁用 |
| loading | `boolean` | `false` | 否 | 名称前是否带 loading 图标 |
| formType | `keyof FormType` |  | 否 | 用于 `<form/>` 组件，点击分别会触发 `<form/>` 组件的 submit/reset 事件 |
| openType | `OpenType` |  | 否 | 微信开放能力 |
| hoverClass | `string` | `button-hover` | 否 | 指定按下去的样式类。当 `hover-class="none"` 时，没有点击态效果 |
| hoverStyle | `StyleProp<ViewStyle>` | `none` | 否 | 由于 RN 不支持 Class，故 RN 端的 Button 组件实现了 `hoverStyle`属性，写法和 style 类似，只不过 `hoverStyle` 的样式是指定按下去的样式。 |
| hoverStopPropagation | `boolean` | `false` | 否 | 指定是否阻止本节点的祖先节点出现点击态 |
| hoverStartTime | `number` | `20` | 否 | 按住后多久出现点击态，单位毫秒 |
| hoverStayTime | `number` | `70` | 否 | 手指松开后点击态保留时间，单位毫秒 |
| lang | `keyof Lang` |  | 否 | 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。<br /><br />生效时机: `open-type="getUserInfo"` |
| sessionFrom | `string` |  | 否 | 会话来源<br /><br />生效时机：`open-type="contact"` |
| sendMessageTitle | `string` | `当前标题` | 否 | 会话内消息卡片标题<br /><br />生效时机：`open-type="contact"` |
| sendMessagePath | `string` | `当前标题` | 否 | 会话内消息卡片点击跳转小程序路径<br /><br />生效时机：`open-type="contact"` |
| sendMessageImg | `string` | `截图` | 否 | 会话内消息卡片图片<br /><br />生效时机：`open-type="contact"` |
| appParameter | `string` |  | 否 | 打开 APP 时，向 APP 传递的参数<br /><br />生效时机：`open-type="launchApp"` |
| businessId | `string` |  | 否 | 微信小程序子商户能力中，添加 business-id 字段指向子商户<br /><br />生效时机：`open-type="contact"` |
| scope | "userInfo" or "phoneNumber" |  | 否 | 支付宝小程序 scope<br /><br />生效时机：`open-type="getAuthorize"` |
| showMessageCard | `boolean` | `false` | 否 | 显示会话内消息卡片<br /><br />生效时机：`open-type="contact"` |
| onGetUserInfo | `CommonEventFunction<onGetUserInfoEventDetail>` |  | 否 | 用户点击该按钮时，会返回获取到的用户信息，回调的detail数据与 Taro.getUserInfo 返回的一致<br /><br />生效时机: `open-type="getUserInfo"` |
| onGetAuthorize | `CommonEventFunction` |  | 否 | 支付宝获取会员基础信息授权回调<br /><br />生效时机：`open-type="getAuthorize"` |
| onContact | `CommonEventFunction<onContactEventDetail>` |  | 否 | 客服消息回调<br /><br />生效时机：`open-type="contact"` |
| onGetPhoneNumber | `CommonEventFunction<onGetPhoneNumberEventDetail>` |  | 否 | 获取用户手机号回调<br /><br />生效时机：`open-type="getphonenumber"` |
| onChooseAvatar | `CommonEventFunction<onChooseAvatarEventDetail>` |  | 否 | 获取头像信息<br /><br />生效时机：`open-type="chooseavatar"` |
| onGetRealnameAuthInfo | `CommonEventFunction` |  | 否 | 获取用户实名<br /><br />生效时机：`open-type="getRealnameAuthInfo"` |
| onError | `CommonEventFunction` |  | 否 | 当使用开放能力时，发生错误的回调<br /><br />生效时机：`open-type="launchApp"` |
| onOpenSetting | `CommonEventFunction<onOpenSettingEventDetail>` |  | 否 | 在打开授权设置页后回调<br /><br />生效时机：`open-type="openSetting"` |
| onLaunchapp | `CommonEventFunction` |  | 否 | 打开 APP 成功的回调<br /><br />生效时机：`open-type="launchApp"` |

### API 支持度

| API | 微信小程序 | 支付宝小程序 | QQ 小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| ButtonProps.size | ✔️ | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.type | ✔️ | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.plain | ✔️ | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.disabled | ✔️ | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.loading | ✔️ | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.formType | ✔️ | ✔️ |  |  |  |
| ButtonProps.openType | ✔️ | ✔️ | ✔️ |  |  |
| ButtonProps.hoverClass | ✔️ | ✔️ |  | ✔️ | (支持 hoverStyle 属性，但框架未支持 hoverClass) |
| ButtonProps.hoverStyle |  |  |  |  | ✔️ |
| ButtonProps.hoverStopPropagation | ✔️ | ✔️ |  |  |  |
| ButtonProps.hoverStartTime | ✔️ | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.hoverStayTime | ✔️ | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.lang | ✔️ |  |  |  |  |
| ButtonProps.sessionFrom | ✔️ |  |  |  |  |
| ButtonProps.sendMessageTitle | ✔️ |  |  |  |  |
| ButtonProps.sendMessagePath | ✔️ |  |  |  |  |
| ButtonProps.sendMessageImg | ✔️ |  |  |  |  |
| ButtonProps.appParameter | ✔️ |  | ✔️ |  |  |
| ButtonProps.businessId | ✔️ |  |  |  |  |
| ButtonProps.scope | ✔️ |  |  |  |  |
| ButtonProps.onGetUserInfo | ✔️ |  |  |  |  |
| ButtonProps.onChooseAvatar | ✔️ |  |  |  |  |
| ButtonProps.onGetAuthorize |  | ✔️ |  |  |  |
| ButtonProps.onContact | ✔️ |  |  |  |  |
| ButtonProps.onGetPhoneNumber | ✔️ |  |  |  |  |
| ButtonProps.onGetRealnameAuthInfo | ✔️ |  |  |  |  |
| ButtonProps.onError | ✔️ |  |  |  |  |
| ButtonProps.onOpenSetting | ✔️ |  |  |  |  |
| ButtonProps.onLaunchapp | ✔️ |  |  |  |  |

### Size

size 的合法值

| 参数 | 说明 |
| --- | --- |
| default | 默认大小 |
| mini | 小尺寸 |

### Type

type 的合法值

| 参数 | 说明 |
| --- | --- |
| primary | 绿色 |
| default | 白色 |
| warn | 红色 |

### FormType

form-type 的合法值

| 参数 | 说明 |
| --- | --- |
| submit | 提交表单 |
| reset | 重置表单 |

### OpenType

open-type 的合法值

### openTypeKeys

open-type 的合法值

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| weapp | `{ contact: any; share: any; getPhoneNumber: any; getUserInfo: any; chooseavatar: any; getRealnameAuthInfo: any; launchApp: any; openSetting: any; feedback: any; }` |  |
| alipay | `{ share: any; getAuthorize: any; contactShare: any; lifestyle: any; }` | 支付宝小程序专属的 open-type 合法值<br />[参考地址](https://opendocs.alipay.com/mini/component/button) |
| qq | `{ share: any; getUserInfo: any; launchApp: any; openSetting: any; feedback: any; openGroupProfile: any; addFriend: any; addColorSign: any; openPublicProfile: any; addGroupApp: any; shareMessageToFriend: any; }` | QQ 小程序专属的 open-type 合法值<br />[参考地址](https://q.qq.com/wiki/develop/miniprogram/component/form/button.html) |

### Lang

lang 的合法值

| 参数 | 说明 |
| --- | --- |
| en | 英文 |
| zh_CN | 简体中文 |
| zh_TW | 繁体中文 |

### onGetUserInfoEventDetail

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| userInfo | `{ nickName: string; avatarUrl: string; gender: keyof Gender; province: string; city: string; country: string; }` | 是 |  |
| rawData | `string` | 是 | 不包括敏感信息的原始数据 `JSON` 字符串，用于计算签名 |
| signature | `string` | 是 | 使用 `sha1(rawData + sessionkey)` 得到字符串，用于校验用户信息 |
| encryptedData | `string` | 是 | 包括敏感数据在内的完整用户信息的加密数据 |
| iv | `string` | 是 | 加密算法的初始向量 |
| errMsg | `string` | 是 |  |
| cloudID | `string` | 否 | 敏感数据对应的云 ID，开通[云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)的小程序才会返回，可通过云调用直接获取开放数据，详细见[云调用直接获取开放数据](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#method-cloud) |

### Gender

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

### onChooseAvatarEventDetail

| 参数      | 类型     | 说明               |
| --------- | -------- | ------------------ |
| avatarUrl | `string` | 用户头像的临时链接 |
