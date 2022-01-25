---
title: Taro.login(option)
sidebar_label: login
---

调用接口获取登录凭证（code）。通过凭证进而换取用户登录态信息，包括用户的唯一标识（openid）及本次登录的会话密钥（session_key）等。用户数据的加解密通讯需要依赖会话密钥完成。更多使用方法详见 [小程序登录](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html)。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html)

## 类型

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| timeout | `number` | 否 | 超时时间，单位ms |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| code | `string` | 用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 [auth.code2Session](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html)，使用 code 换取 openid 和 session_key 等信息 |
| errMsg | `string` | 调用结果 |

## 示例代码

```tsx
Taro.login({
  success: function (res) {
    if (res.code) {
      //发起网络请求
      Taro.request({
        url: 'https://test.com/onLogin',
        data: {
          code: res.code
        }
      })
    } else {
      console.log('登录失败！' + res.errMsg)
    }
  }
})
```
