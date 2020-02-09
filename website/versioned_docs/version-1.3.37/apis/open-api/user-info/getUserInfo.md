---
title: Taro.getUserInfo(option)
sidebar_label: getUserInfo
id: version-1.3.37-getUserInfo
original_id: getUserInfo
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

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| lang | `"en" | "zh_CN" | "zh_TW"` | 否 | 显示用户信息的语言 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| withCredentials | `boolean` | 否 | 是否带上登录态信息。当 withCredentials 为 true 时，要求此前有调用过 Taro.login 且登录态尚未过期，此时返回的数据会包含 encryptedData, iv 等敏感信息；当 withCredentials 为 false 时，不要求有登录态，返回的数据不包含 encryptedData, iv 等敏感信息。 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| cloudID | `string` | 敏感数据对应的云 ID，开通[云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)的小程序才会返回，可通过云调用直接获取开放数据，详细见[云调用直接获取开放数据](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#method-cloud) |
| encryptedData | `string` | 包括敏感数据在内的完整用户信息的加密数据，详见 [用户数据的签名验证和加解密]((signature#加密数据解密算法)) |
| iv | `string` | 加密算法的初始向量，详见 [用户数据的签名验证和加解密]((signature#加密数据解密算法)) |
| rawData | `string` | 不包括敏感信息的原始数据字符串，用于计算签名 |
| signature | `string` | 使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，详见 [用户数据的签名验证和加解密](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html) |
| userInfo | `UserInfo` | 用户信息对象，不包含 openid 等敏感信息 |
| errMsg | `string` | 调用结果 |

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
