---
title: Taro.getScreenBrightness(option)
sidebar_label: getScreenBrightness
---

获取屏幕亮度。

**说明**
- 若安卓系统设置中开启了自动调节亮度功能，则屏幕亮度会根据光线自动调整，该接口仅能获取自动调节亮度之前的值，而非实时的亮度值。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.getScreenBrightness.html)

## 类型

```tsx
(option?: Option) => Promise<SuccessCallbackOption>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(option: SuccessCallbackOption) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackOption

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | `number` | 屏幕亮度值，范围 0 ~ 1，0 最暗，1 最亮 |
