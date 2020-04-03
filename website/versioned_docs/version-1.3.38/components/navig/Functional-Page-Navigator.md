---
title: FunctionalPageNavigator
sidebar_label: FunctionalPageNavigator
id: version-1.3.38-Functional-Page-Navigator
original_id: Functional-Page-Navigator
---

仅在插件中有效，用于跳转到插件功能页

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/functional-page-navigator.html)

## 类型

```tsx
ComponentType<FunctionalPageNavigatorProps>
```

## FunctionalPageNavigatorProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| version | "develop" or "trial" or "release" | `"release"` | 否 | 跳转到的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版）；线上版本必须设置为 release |
| name | "loginAndGetUserInfo" or "requestPayment" or "chooseAddress" |  | 否 | 要跳转到的功能页 |
| args | `object` |  | 否 | 功能页参数，参数格式与具体功能页相关 |
| onSuccess | `BaseEventOrigFunction<any>` |  | 否 | 功能页返回，且操作成功时触发， detail 格式与具体功能页相关 |
| onFail | `BaseEventOrigFunction<any>` |  | 否 | 功能页返回，且操作失败时触发， detail 格式与具体功能页相关 |
| onCancel | `BaseEventOrigFunction<any>` |  | 否 | 因用户操作从功能页返回时触发 |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FunctionalPageNavigatorProps.version | ✔️ |  |  |
| FunctionalPageNavigatorProps.name | ✔️ |  |  |
| FunctionalPageNavigatorProps.args | ✔️ |  |  |
| FunctionalPageNavigatorProps.onSuccess | ✔️ |  |  |
| FunctionalPageNavigatorProps.onFail | ✔️ |  |  |
| FunctionalPageNavigatorProps.onCancel | ✔️ |  |  |

### version

version 的合法值

| 参数 | 说明 |
| --- | --- |
| develop | 开发版 |
| trial | 体验版 |
| release | 正式版 |

### name

name 的合法值

| 参数 | 说明 |
| --- | --- |
| loginAndGetUserInfo | [用户信息功能页](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages/user-info.html) |
| requestPayment | [支付功能页](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages/request-payment.html) |
| chooseAddress | [收货地址功能页](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages/choose-address.html) |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FunctionalPageNavigator | ✔️ |  |  |
