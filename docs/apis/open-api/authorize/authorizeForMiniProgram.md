---
title: Taro.authorizeForMiniProgram(option)
sidebar_label: authorizeForMiniProgram
---

**仅小程序插件中能调用该接口**，用法同 [Taro.authorize](./authorize)。目前仅支持三种 scope

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/authorize/wx.authorizeForMiniProgram.html)

## 类型

```tsx
(option: Option) => Promise<TaroGeneral.CallbackResult>
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| scope | `string` | 是 | 需要获取权限的 scope，详见 [scope 列表](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html#scope-%E5%88%97%E8%A1%A8) |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### Scope

scope 合法值

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html#scope-%E5%88%97%E8%A1%A8)

## 示例代码

```tsx
// 可以通过 Taro.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
Taro.authorizeForMiniProgram({
  scope: 'scope.record',
  success () {
    // 用户已经同意小程序使用录音功能，后续调用 Taro.startRecord 接口不会弹窗询问
    Taro.startRecord()
  }
})
```
