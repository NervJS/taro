---
title: Taro.onWindowResize(callback)
sidebar_label: onWindowResize
---

监听窗口尺寸变化事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/window/wx.onWindowResize.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### CallbackResult

| 参数 | 类型 |
| --- | --- |
| size | `Size` |

### Size

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| windowHeight | `number` | 变化后的窗口高度，单位 px |
| windowWidth | `number` | 变化后的窗口宽度，单位 px |
