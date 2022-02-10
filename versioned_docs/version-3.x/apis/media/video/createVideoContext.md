---
title: Taro.createVideoContext(id, component)
sidebar_label: createVideoContext
---

创建 video 上下文 VideoContext 对象。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.createVideoContext.html)

## 类型

```tsx
(id: string, component?: TaroGeneral.IAnyObject) => VideoContext
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | `string` | video 组件的 id |
| component | `TaroGeneral.IAnyObject` | 在自定义组件下，当前组件实例的this，以操作组件内 video 组件 |

## 示例代码

```tsx
videoContext = Taro.createVideoContext('myVideo')
```
