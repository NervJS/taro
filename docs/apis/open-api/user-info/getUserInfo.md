---
title: Taro.getUserInfo(option)
sidebar_label: getUserInfo
---

获取用户信息。

**接口调整说明**
在用户未授权过的情况下调用此接口，将不再出现授权弹窗，会直接进入 fail 回调（详见[《公告》](https://developers.weixin.qq.com/community/develop/doc/0000a26e1aca6012e896a517556c01))。在用户已授权的情况下调用此接口，可成功获取用户信息。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html)

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
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>lang</td>
      <td><code>&quot;en&quot; | &quot;zh_CN&quot; | &quot;zh_TW&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>显示用户信息的语言</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: SuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
    <tr>
      <td>withCredentials</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否带上登录态信息。当 withCredentials 为 true 时，要求此前有调用过 Taro.login 且登录态尚未过期，此时返回的数据会包含 encryptedData, iv 等敏感信息；当 withCredentials 为 false 时，不要求有登录态，返回的数据不包含 encryptedData, iv 等敏感信息。</td>
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
      <td>包括敏感数据在内的完整用户信息的加密数据，详见 <a href="(signature#%E5%8A%A0%E5%AF%86%E6%95%B0%E6%8D%AE%E8%A7%A3%E5%AF%86%E7%AE%97%E6%B3%95)">用户数据的签名验证和加解密</a></td>
    </tr>
    <tr>
      <td>iv</td>
      <td><code>string</code></td>
      <td>加密算法的初始向量，详见 <a href="(signature#%E5%8A%A0%E5%AF%86%E6%95%B0%E6%8D%AE%E8%A7%A3%E5%AF%86%E7%AE%97%E6%B3%95)">用户数据的签名验证和加解密</a></td>
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
      <td><code>UserInfo</code></td>
      <td>用户信息对象，不包含 openid 等敏感信息</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
// 必须是在用户已经授权的情况下调用
Taro.getUserInfo({
  success: function(res) {
    var userInfo = res.userInfo
    var nickName = userInfo.nickName
    var avatarUrl = userInfo.avatarUrl
    var gender = userInfo.gender //性别 0：未知、1：男、2：女
    var province = userInfo.province
    var city = userInfo.city
    var country = userInfo.country
  }
})
```

敏感数据有两种获取方式，一是使用 [加密数据解密算法]((open-ability/signature#加密数据解密算法)) 。
获取得到的开放数据为以下 json 结构：

```json
{
  "openId": "OPENID",
  "nickName": "NICKNAME",
  "gender": GENDER,
  "city": "CITY",
  "province": "PROVINCE",
  "country": "COUNTRY",
  "avatarUrl": "AVATARURL",
  "unionId": "UNIONID",
  "watermark": {
    "appid":"APPID",
    "timestamp": TIMESTAMP
  }
}
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getUserInfo | ✔️ |  |  |
