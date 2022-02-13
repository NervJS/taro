---
title: Taro.offCopyUrl(callback)
sidebar_label: offCopyUrl
---

取消监听用户点击右上角菜单的「复制链接」按钮时触发的事件

> 本接口为 Beta 版本，暂只在 Android 平台支持。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.offCopyUrl.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 用户点击右上角菜单的「复制链接」按钮时触发的事件的回调函数 |
