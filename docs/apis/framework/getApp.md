---
title: Taro.getApp(opts)
sidebar_label: getApp
---

获取到小程序全局唯一的 App 实例。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="百度小程序" src={require('@site/static/img/platform/swan.png').default} className="icon_platform" width="25px"/> <img title="支付宝小程序" src={require('@site/static/img/platform/alipay.png').default} className="icon_platform" width="25px"/> <img title="字节跳动小程序" src={require('@site/static/img/platform/tt.png').default} className="icon_platform" width="25px"/> <img title="QQ 小程序" src={require('@site/static/img/platform/qq.png').default} className="icon_platform" width="25px"/> <img title="京东小程序" src={require('@site/static/img/platform/jd.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/> <img title="快应用" src={require('@site/static/img/platform/quickapp.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/reference/api/getApp.html)

## 类型

```tsx
<T = TaroGeneral.IAnyObject>(opts?: Option) => Instance<T>
```

## 参数

| 参数 | 类型 |
| --- | --- |
| opts | `T` |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| allowDefault | `boolean` | 否 | 在 `App` 未定义时返回默认实现。当App被调用时，默认实现中定义的属性会被覆盖合并到App中。一般用于独立分包 |

### Instance

```tsx
Option | T
```
