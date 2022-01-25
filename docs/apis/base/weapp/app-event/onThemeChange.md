---
title: Taro.onThemeChange(callback)
sidebar_label: onThemeChange
---

监听系统主题改变事件。该事件与 [`App.onThemeChange`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onThemeChange-Object-object) 的回调时机一致。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onThemeChange.html)

## 类型

```tsx
(callback: onThemeChangeCallback) => void
```

## 参数

| 参数 | 类型 |
| --- | --- |
| callback | `onThemeChangeCallback` |

### ITheme

| 参数 | 说明 |
| --- | --- |
| light | 浅色主题 |
| dark | 深色主题 |

### onThemeChangeResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| theme | `keyof ITheme` | 系统当前的主题，取值为`light`或`dark` |

### onThemeChangeCallback

系统主题改变事件的回调函数

```tsx
(res: onThemeChangeResult) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `onThemeChangeResult` |
