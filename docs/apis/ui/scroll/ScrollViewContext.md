---
title: ScrollViewContext
sidebar_label: ScrollViewContext
---

增强 ScrollView 实例，可通过 [Taro.createSelectorQuery](/docs/apis/wxml/createSelectorQuery) 的 [NodesRef.node](/docs/apis/wxml/NodesRef#node) 方法获取。 仅在 `scroll-view` 组件开启 `enhanced` 属性后生效。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/scroll/ScrollViewContext.html)

## 方法

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| scrollEnabled | `boolean` | 滚动开关 |
| bounces | `boolean` | 设置滚动边界弹性 (仅在 iOS 下生效) |
| showScrollbar | `boolean` | 设置是否显示滚动条 |
| pagingEnabled | `boolean` | 分页滑动开关 |
| fastDeceleration | `boolean` | 设置滚动减速速率 |
| decelerationDisabled | `boolean` | 取消滚动惯性 (仅在 iOS 下生效) |

### scrollTo

滚动至指定位置

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/scroll/ScrollViewContext.scrollTo.html)

```tsx
(object: Option) => void
```

| 参数 | 类型 |
| --- | --- |
| object | `Option` |

### scrollIntoView

滚动至指定位置

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/scroll/ScrollViewContext.scrollIntoView.html)

```tsx
(selector: string) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| selector | `string` | 元素选择器 |

## 参数

### scrollTo

#### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| top | `number` | 否 | 顶部距离 |
| left | `number` | 否 | 左边界距离 |
| velocity | `number` | 否 | 初始速度 |
| duration | `number` | 否 | 滚动动画时长 |
| animated | `boolean` | 否 | 是否启用滚动动画 |

## 示例代码

```tsx
Taro.createSelectorQuery()
  .select('#scrollview')
  .node()
  .exec((res) => {
    const scrollView = res[0].node;
    scrollView.scrollEnabled = false;
  })
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| ScrollViewContext | ✔️ |  |  |
| ScrollViewContext.scrollTo | ✔️ |  |  |
| ScrollViewContext.scrollIntoView | ✔️ |  |  |
