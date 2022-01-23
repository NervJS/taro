---
title: SwiperItem
sidebar_label: SwiperItem
---

仅可放置在 swiper 组件中，宽高自动设置为100%
> 不要为 `SwiperItem` 设置 **style** 属性，可以通过 class 设置样式。[7147](https://github.com/NervJS/taro/issues/7147)

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="百度小程序" src={require('@site/static/img/platform/swan.png').default} className="icon_platform" width="25px"/> <img title="支付宝小程序" src={require('@site/static/img/platform/alipay.png').default} className="icon_platform" width="25px"/> <img title="字节跳动小程序" src={require('@site/static/img/platform/tt.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/swiper-item.html)

## 类型

```tsx
ComponentType<SwiperItemProps>
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

## SwiperItemProps

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| itemId | `string` | 否 | 该 swiper-item 的标识符 |

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| SwiperItemProps.itemId | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
