---
title: Taro.getUserProfile(option)
sidebar_label: getUserProfile
---

获取用户信息。每次请求都会弹出授权窗口，用户同意后返回 `userInfo`。

:::tip 
微信基础库 2.10.4 开始支持

Taro 2.2.17，3.0.29，3.1，3.2 已经支持
:::


> [微信端调整背景和说明，请参考文档](https://developers.weixin.qq.com/community/develop/doc/000cacfa20ce88df04cb468bc52801)

## getUserProfile

若开发者需要获取用户的个人信息（头像、昵称、性别与地区），可以通过 Taro.getUserProfile 接口进行获取，微信该接口从基础库 **2.10.4** 版本开始支持，该接口只返回用户个人信息，不包含用户身份标识符。该接口中 desc 属性（声明获取用户个人信息后的用途）后续会展示在弹窗中，请开发者谨慎填写。

开发者每次通过该接口获取用户个人信息均需用户确认，请开发者妥善保管用户快速填写的头像昵称，避免重复弹窗。

## 类型

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style={{ textAlign: "center"}}>必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: SuccessCallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
    <tr>
      <td>lang</td>
      <td><code>&quot;en&quot; | &quot;zh_CN&quot; | &quot;zh_TW&quot;</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>显示用户信息的语言（en: 英文；zh_CN：简体中文；zh_TW：繁体中文</td>
    </tr>
    <tr>
      <td>desc</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>是</td>
      <td>声明获取用户个人信息后的用途，不超过 30 个字符</td>
    </tr>
  </tbody>
</table>

### SuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>cloudID</td>
      <td><code>string</code></td>
      <td>敏感数据对应的云 ID，开通<a href="https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html">云开发</a>的小程序才会返回，可通过云调用直接获取开放数据，详细见<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#method-cloud">云调用直接获取开放数据</a></td>
    </tr>
    <tr>
      <td>encryptedData</td>
      <td><code>string</code></td>
      <td>包括敏感数据在内的完整用户信息的加密数据，详见 <a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html">用户数据的签名验证和加解密</a></td>
    </tr>
    <tr>
      <td>iv</td>
      <td><code>string</code></td>
      <td>加密算法的初始向量，详见 <a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#%E5%8A%A0%E5%AF%86%E6%95%B0%E6%8D%AE%E8%A7%A3%E5%AF%86%E7%AE%97%E6%B3%95">用户数据的签名验证和加解密</a></td>
    </tr>
    <tr>
      <td>rawData</td>
      <td><code>string</code></td>
      <td>不包括敏感信息的原始数据字符串，用于计算签名</td>
    </tr>
    <tr>
      <td>signature</td>
      <td><code>string</code></td>
      <td>使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，详见 <a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html">用户数据的签名验证和加解密</a></td>
    </tr>
    <tr>
      <td>userInfo</td>
      <td> UserInfo </td>
      <td>用户信息对象 (文档参考 API > 开发接口 > 用户信息 > UserInfo)</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
Taro.getUserProfile({
  desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  success: (res) => {
    this.setState({
      userInfo: res.userInfo,
      hasUserInfo: true
    })
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getUserProfile | ✔️ |  |  |


## 相关资料

相关 issue : [Taro什么时候支持 getUserProfile 方法](https://github.com/NervJS/taro/issues/8810)