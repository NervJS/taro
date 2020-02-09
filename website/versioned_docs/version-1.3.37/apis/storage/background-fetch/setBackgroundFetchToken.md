---
title: Taro.setBackgroundFetchToken(option)
sidebar_label: setBackgroundFetchToken
id: version-1.3.37-setBackgroundFetchToken
original_id: setBackgroundFetchToken
---

设置自定义登录态，在周期性拉取数据时带上，便于第三方服务器验证请求合法性

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/storage/background-fetch/wx.setBackgroundFetchToken.html)

## 类型

```tsx
(option: Option) => void
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| token | `string` | 是 | 自定义的登录态 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setBackgroundFetchToken | ✔️ |  |  |
