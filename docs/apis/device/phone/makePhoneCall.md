---
title: Taro.makePhoneCall(option)
sidebar_label: makePhoneCall
---

拨打电话

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/phone/wx.makePhoneCall.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| phoneNumber | `string` | 是 | 需要拨打的电话号码 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.makePhoneCall({
  phoneNumber: '1340000' //仅为示例，并非真实的电话号码
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.makePhoneCall | ✔️ | ✔️ | ✔️ |
