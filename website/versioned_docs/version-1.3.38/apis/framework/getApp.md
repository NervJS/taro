---
title: Taro.getApp(opts)
sidebar_label: getApp
id: version-1.3.38-getApp
original_id: getApp
---

获取到小程序全局唯一的 App 实例。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/reference/api/getApp.html)

## 类型

```tsx
<T = Record<string, any>>(opts?: Option) => Instance<T>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| allowDefault | `boolean` | 否 | 在 `App` 未定义时返回默认实现。当App被调用时，默认实现中定义的属性会被覆盖合并到App中。一般用于独立分包 |

### Instance

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | 京东小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.getApp | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
