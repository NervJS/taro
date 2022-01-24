---
title: PageContainer
sidebar_label: PageContainer
---

页面容器

小程序如果在页面内进行复杂的界面设计（如在页面内弹出半屏的弹窗、在页面内加载一个全屏的子页面等），用户进行返回操作会直接离开当前页面，不符合用户预期，预期应为关闭当前弹出的组件。
为此提供“假页”容器组件，效果类似于 `popup` 弹出层，页面内存在该容器时，当用户进行返回操作，关闭该容器不关闭页面。返回操作包括三种情形，右滑手势、安卓物理返回键和调用 `navigateBack` 接口。

Bug & Tip
 1. tip: 当前页面最多只有 1 个容器，若已存在容器的情况下，无法增加新的容器
 2. tip: wx.navigateBack 无法在页面栈顶调用，此时没有上一级页面

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/page-container.html)

## 类型

```tsx
ComponentType<PageContainerProps>
```

## PageContainerProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| show | `boolean` | `false` | 否 | 是否显示容器组件 |
| duration | `number` | `300` | 否 | 动画时长，单位毫秒 |
| zIndex | `number` | `100` | 否 | z-index 层级 |
| overlay | `boolean` | `true` | 否 | 是否显示遮罩层 |
| position | `keyof position` | `bottom` | 否 | 弹出位置，可选值为 top bottom right center |
| round | `boolean` | `false` | 否 | 是否显示圆角 |
| closeOnSlideDown | `boolean` | `false` | 否 | 自定义遮罩层样式 |
| overlayStyle | `boolean` |  | 否 | 是否在下滑一段距离后关闭 |
| customStyle | `boolean` |  | 否 | 自定义弹出层样式 |
| onBeforeEnter | `CommonEventFunction` |  | 否 | 进入前触发 |
| onEnter | `CommonEventFunction` |  | 否 | 进入中触发 |
| onAfterEnter | `CommonEventFunction` |  | 否 | 进入后触发 |
| onBeforeLeave | `CommonEventFunction` |  | 否 | 离开前触发 |
| onLeave | `CommonEventFunction` |  | 否 | 离开中触发 |
| onAfterLeave | `CommonEventFunction` |  | 否 | 离开后触发 |
| onClickOverlay | `CommonEventFunction` |  | 否 | 点击遮罩层时触发 |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PageContainerProps.show | ✔️ |  |  |
| PageContainerProps.duration | ✔️ |  |  |
| PageContainerProps.zIndex | ✔️ |  |  |
| PageContainerProps.overlay | ✔️ |  |  |
| PageContainerProps.position | ✔️ |  |  |
| PageContainerProps.round | ✔️ |  |  |
| PageContainerProps.closeOnSlideDown | ✔️ |  |  |
| PageContainerProps.overlayStyle | ✔️ |  |  |
| PageContainerProps.customStyle | ✔️ |  |  |
| PageContainerProps.onBeforeEnter | ✔️ |  |  |
| PageContainerProps.onEnter | ✔️ |  |  |
| PageContainerProps.onAfterEnter | ✔️ |  |  |
| PageContainerProps.onBeforeLeave | ✔️ |  |  |
| PageContainerProps.onLeave | ✔️ |  |  |
| PageContainerProps.onAfterLeave | ✔️ |  |  |
| PageContainerProps.onClickOverlay | ✔️ |  |  |

### position

弹出位置

| 参数 | 说明 |
| --- | --- |
| top | 上方弹出 |
| bottom | 下方弹出 |
| left | 左边弹出 |
| right | 右边弹出 |
