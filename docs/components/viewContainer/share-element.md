---
title: ShareElement
sidebar_label: ShareElement
---

共享元素

共享元素是一种动画形式，类似于 [`flutter Hero`](https://flutterchina.club/animations/hero-animations/) 动画，表现为元素像是在页面间穿越一样。该组件需与 [`page-container`](/docs/components/viewContainer/page-container) 组件结合使用。
使用时需在当前页放置 `share-element` 组件，同时在 `page-container` 容器中放置对应的 `share-element` 组件，对应关系通过属性值 key 映射。当设置 `page-container` `显示时，transform` 属性为 `true` 的共享元素会产生动画。当前页面容器退出时，会产生返回动画。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/share-element.html)

## 类型

```tsx
ComponentType<ShareElementProps>
```

## ShareElementProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| key | `string` |  | 是 | 映射标记 |
| transform | `boolean` | `false` | 否 | 是否进行动画 |
| duration | `number` | `300` | 否 | 动画时长，单位毫秒 |
| easingFunction | `number` | `ease-out` | 否 | css缓动函数 |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| ShareElementProps.key | ✔️ |  |  |
| ShareElementProps.transform | ✔️ |  |  |
| ShareElementProps.duration | ✔️ |  |  |
| ShareElementProps.easingFunction | ✔️ |  |  |
