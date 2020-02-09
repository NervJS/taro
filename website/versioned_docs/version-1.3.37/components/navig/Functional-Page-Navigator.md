---
title: FunctionalPageNavigator
sidebar_label: FunctionalPageNavigator
id: version-1.3.37-Functional-Page-Navigator
original_id: Functional-Page-Navigator
---

## 类型

```tsx
ComponentType<FunctionalPageNavigatorProps>
```

## FunctionalPageNavigatorProps

> 最低 Taro 版本: 2.1.0

这个组件从小程序基础库版本 2.1.0 开始支持。
仅在插件的自定义组件中有效，用于跳转到插件功能页。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/functional-page-navigator.html)

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| version | `string` | 是 | 跳转到的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版）；线上版本必须设置为 release<br />默认值：`release` |
| name | `"loginAndGetUserInfo" | "requestPayment"` | 是 | 要跳转到的功能页<br />目前支持的功能页和name 有效值：<br />loginAndGetUserInfo|[用户信息功能页](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages/user-info.html)<br />requestPayment|[支付功能页](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages/request-payment.html) |
| args | `object` | 是 | 功能页参数，参数格式与具体功能页相关<br />默认值：`null` |
| onSuccess | `BaseEventOrigFunction<any>` | 否 | 功能页返回，且操作成功时触发， detail 格式与具体功能页相关 |
| onFail | `BaseEventOrigFunction<any>` | 否 | 功能页返回，且操作失败时触发， detail 格式与具体功能页相关 |
