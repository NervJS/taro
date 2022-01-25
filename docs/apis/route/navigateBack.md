---
title: Taro.navigateBack(option)
sidebar_label: navigateBack
---

关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateBack.html)

## 类型

```tsx
(option?: Option) => Promise<TaroGeneral.CallbackResult>
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| delta | `number` | 否 | 返回的页面数，如果 delta 大于现有页面数，则返回到首页。 |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
// 注意：调用 navigateTo 跳转时，调用该方法的页面会被加入堆栈，而 redirectTo 方法则不会。见下方示例代码
// 此处是A页面
Taro.navigateTo({
  url: 'B?id=1'
})
// 此处是B页面
Taro.navigateTo({
  url: 'C?id=1'
})
// 在C页面内 navigateBack，将返回A页面
Taro.navigateBack({
  delta: 2
})
```
