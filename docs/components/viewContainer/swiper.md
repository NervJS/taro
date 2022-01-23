---
title: Swiper
sidebar_label: Swiper
---

滑块视图容器。其中只可放置 swiper-item 组件，否则会导致未定义的行为。
> 不要为 `SwiperItem` 设置 **style** 属性，可以通过 class 设置样式。[7147](https://github.com/NervJS/taro/issues/7147)

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="百度小程序" src={require('@site/static/img/platform/swan.png').default} className="icon_platform" width="25px"/> <img title="支付宝小程序" src={require('@site/static/img/platform/alipay.png').default} className="icon_platform" width="25px"/> <img title="字节跳动小程序" src={require('@site/static/img/platform/tt.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html)

## 类型

```tsx
ComponentType<SwiperProps>
```

## 示例代码

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

<Tabs
  defaultValue="React"
  values={[
  {
    "label": "React",
    "value": "React"
  },
  {
    "label": "Vue",
    "value": "Vue"
  }
]}>
<TabItem value="React">

```tsx
class App extends Component {
  render () {
    return (
      <Swiper
        className='test-h'
        indicatorColor='#999'
        indicatorActiveColor='#333'
        vertical
        circular
        indicatorDots
        autoplay>
        <SwiperItem>
          <View className='demo-text-1'>1</View>
        </SwiperItem>
        <SwiperItem>
          <View className='demo-text-2'>2</View>
        </SwiperItem>
        <SwiperItem>
          <View className='demo-text-3'>3</View>
        </SwiperItem>
      </Swiper>
    )
  }
}
```
</TabItem>
<TabItem value="Vue">

```html
<template>
  <swiper
    class='test-h'
    indicator-color='#999'
    indicator-active-color='#333'
    :vertical="true"
    :circular="true"
    :indicator-dots="true"
    :autoplay="true"
  >
    <swiper-item>
      <view class='demo-text-1'>1</view>
    </swiper-item>
    <swiper-item>
      <view class='demo-text-2'>2</view>
    </swiper-item>
    <swiper-item>
      <view class='demo-text-3'>3</view>
    </swiper-item>
  </swiper>
</template>
```
</TabItem>
</Tabs>

## SwiperProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| indicatorDots | `boolean` | `false` | 否 | 是否显示面板指示点 |
| indicatorColor | `string` | `"rgba(0, 0, 0, .3)"` | 否 | 指示点颜色 |
| indicatorActiveColor | `string` | `"#000000"` | 否 | 当前选中的指示点颜色 |
| autoplay | `boolean` | `false` | 否 | 是否自动切换 |
| current | `number` | `0` | 否 | 当前所在滑块的 index |
| currentItemId | `string` | `""` | 否 | 当前所在滑块的 item-id ，不能与 current 被同时指定 |
| interval | `number` | `5000` | 否 | 自动切换时间间隔 |
| duration | `number` | `500` | 否 | 滑动动画时长 |
| circular | `boolean` | `false` | 否 | 是否采用衔接滑动 |
| vertical | `boolean` | `false` | 否 | 滑动方向是否为纵向 |
| previousMargin | `string` | `"0px"` | 否 | 前边距，可用于露出前一项的一小部分，接受 px 和 rpx 值 |
| nextMargin | `string` | `"0px"` | 否 | 后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值 |
| snapToEdge | `boolean` | `false` | 否 | 当 swiper-item 的个数大于等于 2，关闭 circular 并且开启 previous-margin 或 next-margin 的时候，可以指定这个边距是否应用到第一个、最后一个元素 |
| displayMultipleItems | `number` | `1` | 否 | 同时显示的滑块数量 |
| skipHiddenItemLayout | `boolean` | `false` | 否 | 是否跳过未显示的滑块布局，设为 true 可优化复杂情况下的滑动性能，但会丢失隐藏状态滑块的布局信息 |
| easingFunction | `keyof TEasingFunction` | `"default"` | 否 | 指定 swiper 切换缓动动画类型 |
| onChange | `CommonEventFunction<onChangeEventDetail>` |  | 否 | current 改变时会触发 change 事件 |
| onTransition | `CommonEventFunction<onTransitionEventDetail>` |  | 否 | swiper-item 的位置发生改变时会触发 transition 事件 |
| onAnimationFinish | `CommonEventFunction<onChangeEventDetail>` |  | 否 | 动画结束时会触发 animationfinish 事件 |
| disableTouch | `boolean` | `false` | 否 | 是否禁止用户 touch 操作 |

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| SwiperProps.indicatorDots | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.indicatorColor | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.indicatorActiveColor | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.autoplay | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.current | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.interval | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.duration | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| SwiperProps.circular | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.vertical | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.previousMargin | ✔️ |  |  |  | ✔️ |  |
| SwiperProps.nextMargin | ✔️ |  |  |  | ✔️ |  |
| SwiperProps.snapToEdge | ✔️ |  |  |  |  |  |
| SwiperProps.displayMultipleItems | ✔️ | ✔️ |  | ✔️ | ✔️ |  |
| SwiperProps.skipHiddenItemLayout | ✔️ | ✔️ |  |  |  |  |
| SwiperProps.easingFunction | ✔️ |  |  |  |  |  |
| SwiperProps.onChange | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.onTransition | ✔️ |  |  |  |  |  |
| SwiperProps.onAnimationFinish | ✔️ | ✔️ |  |  | ✔️ | ✔️ |
| SwiperProps.disableTouch |  |  | ✔️ |  |  |  |

### TChangeSource

导致变更的原因

| 参数 | 说明 |
| --- | --- |
| autoplay | 自动播放 |
| touch | 用户划动 |
|  | 其它原因 |

### TEasingFunction

指定 swiper 切换缓动动画类型

| 参数 | 说明 |
| --- | --- |
| default | 默认缓动函数 |
| linear | 线性动画 |
| easeInCubic | 缓入动画 |
| easeOutCubic | 缓出动画 |
| easeInOutCubic | 缓入缓出动画 |

### onChangeEventDetail

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| current | `number` | 是 | 当前所在滑块的索引 |
| source | `keyof TChangeSource` | 是 | 导致变更的原因 |
| currentItemId | `string` | 否 | SwiperItem的itemId参数值 |

### onTransitionEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| dx | `number` | X 坐标 |
| dy | `number` | Y 坐标 |
