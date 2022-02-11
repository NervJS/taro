---
title: Taro.getUserProfile(option)
sidebar_label: getUserProfile
---

> 最低 Taro 版本: 2.2.17+，3.0.29+

获取用户信息。每次请求都会弹出授权窗口，用户同意后返回 `userInfo`。

若开发者需要获取用户的个人信息（头像、昵称、性别与地区），可以通过 Taro.getUserProfile 接口进行获取，

微信该接口从基础库 **2.10.4** 版本开始支持，该接口只返回用户个人信息，不包含用户身份标识符。该接口中 desc 属性（声明获取用户个人信息后的用途）后续会展示在弹窗中，请开发者谨慎填写。

开发者每次通过该接口获取用户个人信息均需用户确认，请开发者妥善保管用户快速填写的头像昵称，避免重复弹窗。

[微信端调整背景和说明，请参考文档](https://developers.weixin.qq.com/community/develop/doc/000cacfa20ce88df04cb468bc52801)

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserProfile.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult>
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| lang | `keyof language` | 否 | 显示用户信息的语言 |
| desc | `string` | 是 | 声明获取用户个人信息后的用途，不超过30个字符 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| userInfo | `UserInfo` | 用户信息对象 |
| rawData | `string` | 不包括敏感信息的原始数据字符串，用于计算签名 |
| signature | `string` | 使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，详见 [用户数据的签名验证和加解密](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html) |
| encryptedData | `string` | 包括敏感数据在内的完整用户信息的加密数据，详见 [用户数据的签名验证和加解密](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#%E5%8A%A0%E5%AF%86%E6%95%B0%E6%8D%AE%E8%A7%A3%E5%AF%86%E7%AE%97%E6%B3%95) |
| iv | `string` | 加密算法的初始向量，详见 [用户数据的签名验证和加解密](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#%E5%8A%A0%E5%AF%86%E6%95%B0%E6%8D%AE%E8%A7%A3%E5%AF%86%E7%AE%97%E6%B3%95) |
| cloudID | `string` | 敏感数据对应的云 ID，开通云开发的小程序才会返回，可通过云调用直接获取开放数据，详细 [见云调用直接获取开放数据](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#method-cloud) |

## 示例代码

推荐使用 Taro.getUserProfile 获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认

```tsx
Taro.getUserProfile({
  desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  success: (res) => {
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    this.setState({
      userInfo: res.userInfo,
      hasUserInfo: true
    })
  }
})
```

## 相关资料

相关 issue : [Taro什么时候支持 getUserProfile 方法](https://github.com/NervJS/taro/issues/8810)
