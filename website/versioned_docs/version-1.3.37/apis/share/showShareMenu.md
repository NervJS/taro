---
title: Taro.showShareMenu(option)
sidebar_label: showShareMenu
id: version-1.3.37-showShareMenu
original_id: showShareMenu
---

显示当前页面的转发按钮

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.showShareMenu.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| withShareTicket | `boolean` | 否 | 是否使用带 shareTicket 的转发[详情](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html) |
| showShareItems | `string[]` | 否 | QQ小程序分享功能，支持分享到QQ、QQ空间、微信好友、微信朋友圈<br />支持的值： ['qq', 'qzone', 'wechatFriends', 'wechatMoment']<br />API 支持度: qq |

#### API 支持度

| API | 微信小程序 | QQ 小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: |
| Option.showShareItems |  | ✔️ |  |  |

## 示例代码

```tsx
Taro.showShareMenu({
  withShareTicket: true
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.showShareMenu | ✔️ |  |  |
