---
title: Swiper
sidebar_label: Swiper
---

Swiper view container. Only the swiper-item component can be placed in it. Otherwise, undefined behavior will occur.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/swiper.html)

## Type

```tsx
ComponentType<SwiperProps>
```

## Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="React"
  values={[
    {label: 'React', value: 'React'},
    {label: 'Vue', value: 'Vue'}
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

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>indicatorDots</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to display the indicator of the panel.</td>
    </tr>
    <tr>
      <td>indicatorColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;rgba(0, 0, 0, .3)&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The color of the indicator.</td>
    </tr>
    <tr>
      <td>indicatorActiveColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;#000000&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The color of the currently selected indicator.</td>
    </tr>
    <tr>
      <td>autoplay</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to enable auto switching.</td>
    </tr>
    <tr>
      <td>current</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The index of the current swiper.</td>
    </tr>
    <tr>
      <td>currentItemId</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The item-id of the current swiper cannot be specified at the same time as current.</td>
    </tr>
    <tr>
      <td>interval</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>5000</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The interval of auto switching.</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>500</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Duration of the swiping animation.</td>
    </tr>
    <tr>
      <td>circular</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to use circular swiping.</td>
    </tr>
    <tr>
      <td>vertical</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to swipe vertically.</td>
    </tr>
    <tr>
      <td>previousMargin</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;0px&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The previous margin. It can be used to expose a small section of the previous item. Values in both px and rpx are supported.</td>
    </tr>
    <tr>
      <td>nextMargin</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;0px&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The next margin. It can be used to expose a small section of the next item. Values in both px and rpx are supported.</td>
    </tr>
    <tr>
      <td>displayMultipleItems</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>1</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The number of swipers displayed concurrently.</td>
    </tr>
    <tr>
      <td>skipHiddenItemLayout</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to skip the swiper block that is not displayed. When it is set to true, the swiping performance in complex cases can be optimized, but the layout information of the hidden swiper block will be discarded.</td>
    </tr>
    <tr>
      <td>easingFunction</td>
      <td><code>&quot;default&quot; | &quot;linear&quot; | &quot;easeInCubic&quot; | &quot;easeOutCubic&quot; | &quot;easeInOutCubic&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;default&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the animation easing type for the swiper.</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDeatil&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>A change event triggered when the value of the current component changes.</td>
    </tr>
    <tr>
      <td>onTransition</td>
      <td><code>BaseEventOrigFunction&lt;onTransitionEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>A transition event triggered when the location of the swiper-item component changes.</td>
    </tr>
    <tr>
      <td>onAnimationFinish</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDeatil&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>An animationfinish event triggered when an animation ends.</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
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
| SwiperProps.displayMultipleItems | ✔️ | ✔️ |  | ✔️ | ✔️ |  |
| SwiperProps.skipHiddenItemLayout | ✔️ | ✔️ |  |  |  |  |
| SwiperProps.easingFunction | ✔️ |  |  |  |  |  |
| SwiperProps.onChange | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.onTransition | ✔️ |  |  |  |  |  |
| SwiperProps.onAnimationFinish | ✔️ | ✔️ |  |  | ✔️ | ✔️ |

### TChangeSource

Reasons for change.

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>autoplay</td>
      <td>Autoplay</td>
    </tr>
    <tr>
      <td>touch</td>
      <td>User paddle</td>
    </tr>
    <tr>
      <td></td>
      <td>Other reasons</td>
    </tr>
  </tbody>
</table>

### TEasingFunction

Valid values of easing-function

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>default</td>
      <td>Default easing function</td>
    </tr>
    <tr>
      <td>linear</td>
      <td>Linear animation</td>
    </tr>
    <tr>
      <td>easeInCubic</td>
      <td>Ease-in animation</td>
    </tr>
    <tr>
      <td>easeOutCubic</td>
      <td>Ease-out animation</td>
    </tr>
    <tr>
      <td>easeInOutCubic</td>
      <td>Ease-in and ease-out animations</td>
    </tr>
  </tbody>
</table>

### onChangeEventDeatil

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>current</td>
      <td><code>number</code></td>
      <td>The index of the current swiper.</td>
    </tr>
    <tr>
      <td>source</td>
      <td><code>&quot;&quot; | &quot;autoplay&quot; | &quot;touch&quot;</code></td>
      <td>Reasons for change.</td>
    </tr>
  </tbody>
</table>

### onTransitionEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dx</td>
      <td><code>number</code></td>
      <td>X-coordinate</td>
    </tr>
    <tr>
      <td>dy</td>
      <td><code>number</code></td>
      <td>Y-coordinate</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Swiper | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

## NOTE

* Do not set the **style** attribute for `SwiperItem`, you can set the style via class. [7147](https://github.com/NervJS/taro/issues/7147)
