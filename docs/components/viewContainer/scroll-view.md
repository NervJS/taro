---
title: ScrollView
sidebar_label: ScrollView
---

可滚动视图区域。使用竖向滚动时，需要给scroll-view一个固定高度，通过 WXSS 设置 height。组件属性的长度单位默认为 px

Tips:
H5 中 ScrollView 组件是通过一个高度（或宽度）固定的容器内部滚动来实现的，因此务必正确的设置容器的高度。例如: 如果 ScrollView 的高度将 body 撑开，就会同时存在两个滚动条（body 下的滚动条，以及 ScrollView 的滚动条）。
微信小程序 中 ScrollView 组件如果设置 scrollX 横向滚动时，并且子元素为多个时（单个子元素时设置固定宽度则可以正常横向滚动），需要通过 WXSS 设置 `white-space: nowrap` 来保证元素不换行，并对 ScrollView 内部元素设置 `display: inline-block` 来使其能够横向滚动。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="百度小程序" src={require('@site/static/img/platform/swan.png').default} className="icon_platform" width="25px"/> <img title="支付宝小程序" src={require('@site/static/img/platform/alipay.png').default} className="icon_platform" width="25px"/> <img title="字节跳动小程序" src={require('@site/static/img/platform/tt.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html)

## 类型

```tsx
ComponentType<ScrollViewProps>
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
export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  onScrollToUpper() {}

  // or 使用箭头函数
  // onScrollToUpper = () => {}

  onScroll(e){
    console.log(e.detail)
  }

  render() {
    const scrollStyle = {
      height: '150px'
    }
    const scrollTop = 0
    const Threshold = 20
    const vStyleA = {
      height: '150px',
      'background-color': 'rgb(26, 173, 25)'
    }
    const vStyleB = {
       height: '150px',
      'background-color': 'rgb(39,130,215)'
    }
    const vStyleC = {
      height: '150px',
      'background-color': 'rgb(241,241,241)',
      color: '#333'
    }
    return (
      <ScrollView
        className='scrollview'
        scrollY
        scrollWithAnimation
        scrollTop={scrollTop}
        style={scrollStyle}
        lowerThreshold={Threshold}
        upperThreshold={Threshold}
        onScrollToUpper={this.onScrollToUpper.bind(this)} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
        onScroll={this.onScroll}
      >
        <View style={vStyleA}>A</View>
        <View style={vStyleB}>B</View>
        <View style={vStyleC}>C</View>
      </ScrollView>
    )
  }
}
```
</TabItem>
<TabItem value="Vue">

```html
<template>
  <view class="container">
    <view class="page-body">
      <view class="page-section">
        <view class="page-section-title">
          <text>Vertical Scroll - 纵向滚动</text>
        </view>
        <view class="page-section-spacing">
          <scroll-view :scroll-y="true" style="height: 300rpx;" @scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll" :scroll-into-view="toView" :scroll-top="scrollTop">
            <view id="demo1" class="scroll-view-item demo-text-1">1</view>
            <view id="demo2"  class="scroll-view-item demo-text-2">2</view>
            <view id="demo3" class="scroll-view-item demo-text-3">3</view>
          </scroll-view>
        </view>
      </view>
      <view class="page-section">
        <view class="page-section-title">
          <text>Horizontal Scroll - 横向滚动</text>
        </view>
        <view class="page-section-spacing">
          <scroll-view class="scroll-view_H" :scroll-x="true" @scroll="scroll" style="width: 100%">
            <view id="demo21" class="scroll-view-item_H demo-text-1">a</view>
            <view id="demo22"  class="scroll-view-item_H demo-text-2">b</view>
            <view id="demo23" class="scroll-view-item_H demo-text-3">c</view>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const order = ['demo1', 'demo2', 'demo3']
export default {
  name: 'Index',
  data() {
    return {
      scrollTop: 0,
      toView: 'demo2'
    }
  },

  methods: {
    upper(e) {
      console.log('upper:', e)
    },

    lower(e) {
      console.log('lower:', e)
    },

    scroll(e) {
      console.log('scroll:', e)
    }
  }
}
</script>

<style>
.page-section-spacing{
  margin-top: 60rpx;
}
.scroll-view_H{
  white-space: nowrap;
}
.scroll-view-item{
  height: 300rpx;
}
.scroll-view-item_H{
  display: inline-block;
  width: 100%;
  height: 300rpx;
}

.demo-text-1 { background: #ccc; }
.demo-text-2 { background: #999; }
.demo-text-3 { background: #666; }
</style>
```
</TabItem>
</Tabs>

## ScrollViewProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| scrollX | `boolean` | `false` | 否 | 允许横向滚动 |
| scrollY | `boolean` | `false` | 否 | 允许纵向滚动 |
| upperThreshold | `number` | `50` | 否 | 距顶部/左边多远时（单位px），触发 scrolltoupper 事件 |
| lowerThreshold | `number` | `50` | 否 | 距底部/右边多远时（单位px），触发 scrolltolower 事件 |
| scrollTop | `number` |  | 否 | 设置竖向滚动条位置 |
| scrollLeft | `number` |  | 否 | 设置横向滚动条位置 |
| scrollIntoView | `string` |  | 否 | 值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素 |
| scrollWithAnimation | `boolean` | `false` | 否 | 在设置滚动条位置时使用动画过渡 |
| enableBackToTop | `boolean` | `false` | 否 | iOS 点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向 |
| enableFlex | `boolean` | `false` | 否 | 启用 flexbox 布局。开启后，当前节点声明了 `display: flex` 就会成为 flex container，并作用于其孩子节点。 |
| scrollAnchoring | `boolean` | `false` | 否 | 开启 scroll anchoring 特性，即控制滚动位置不随内容变化而抖动，仅在 iOS 下生效，安卓下可参考 CSS `overflow-anchor` 属性。 |
| refresherEnabled | `boolean` | `false` | 否 | 开启自定义下拉刷新 |
| refresherThreshold | `number` | `45` | 否 | 设置自定义下拉刷新阈值 |
| refresherDefaultStyle | `string` | `'black'` | 否 | 设置自定义下拉刷新默认样式，支持设置 `black or white or none`， none 表示不使用默认样式 |
| refresherBackground | `string` | `'#FFF'` | 否 | 设置自定义下拉刷新区域背景颜色 |
| refresherTriggered | `boolean` | `false` | 否 | 设置当前下拉刷新状态，true 表示下拉刷新已经被触发，false 表示下拉刷新未被触发 |
| enhanced | `boolean` | `false` | 否 | 启用 scroll-view 增强特性 |
| bounces | `boolean` | `true` | 否 | iOS 下 scroll-view 边界弹性控制 (同时开启 enhanced 属性后生效) |
| showScrollbar | `boolean` | `true` | 否 | 滚动条显隐控制 (同时开启 enhanced 属性后生效) |
| pagingEnabled | `boolean` | `false` | 否 | 分页滑动效果 (同时开启 enhanced 属性后生效) |
| fastDeceleration | `boolean` | `false` | 否 | boolean	false	滑动减速速率控制 (同时开启 enhanced 属性后生效) |
| onScrollToUpper | `CommonEventFunction<any>` |  | 否 | 滚动到顶部/左边，会触发 scrolltoupper 事件 |
| onScrollToLower | `CommonEventFunction<any>` |  | 否 | 滚动到底部/右边，会触发 scrolltolower 事件 |
| onScroll | `BaseEventOrigFunction<onScrollDetail>` |  | 否 | 滚动时触发<br />`event.detail = {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY}` |
| onRefresherPulling | `CommonEventFunction<any>` |  | 否 | 自定义下拉刷新控件被下拉 |
| onRefresherRefresh | `CommonEventFunction<any>` |  | 否 | 自定义下拉刷新被触发 |
| onRefresherRestore | `CommonEventFunction<any>` |  | 否 | 自定义下拉刷新被复位 |
| onRefresherAbort | `CommonEventFunction<any>` |  | 否 | 自定义下拉刷新被中止 |
| onDragStart | `CommonEventFunction<any>` |  | 否 | 滑动开始事件 (同时开启 enhanced 属性后生效) |
| onDragging | `CommonEventFunction<any>` |  | 否 | 滑动事件 (同时开启 enhanced 属性后生效) |
| onDragEnd | `CommonEventFunction<any>` |  | 否 | 滑动结束事件 (同时开启 enhanced 属性后生效) |

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| ScrollViewProps.scrollX | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️(二选一) |
| ScrollViewProps.scrollY | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️(二选一) |
| ScrollViewProps.upperThreshold | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ScrollViewProps.lowerThreshold | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ScrollViewProps.scrollTop | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ScrollViewProps.scrollLeft | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ScrollViewProps.scrollIntoView | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| ScrollViewProps.scrollWithAnimation | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ScrollViewProps.enableBackToTop | ✔️ |  | ✔️ |  |  | ✔️ |
| ScrollViewProps.enableFlex | ✔️ |  |  |  |  |  |
| ScrollViewProps.scrollAnchoring | ✔️ |  |  |  |  |  |
| ScrollViewProps.refresherEnabled | ✔️ |  |  |  |  |  |
| ScrollViewProps.refresherThreshold | ✔️ |  |  |  |  |  |
| ScrollViewProps.refresherDefaultStyle | ✔️ |  |  |  |  |  |
| ScrollViewProps.refresherBackground | ✔️ |  |  |  |  |  |
| ScrollViewProps.refresherTriggered | ✔️ |  |  |  |  |  |
| ScrollViewProps.enhanced | ✔️ |  |  |  |  |  |
| ScrollViewProps.bounces | ✔️ |  |  |  |  |  |
| ScrollViewProps.showScrollbar | ✔️ |  |  |  |  |  |
| ScrollViewProps.pagingEnabled | ✔️ |  |  |  |  |  |
| ScrollViewProps.fastDeceleration | ✔️ |  |  |  |  |  |
| ScrollViewProps.onScrollToUpper | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ScrollViewProps.onScrollToLower | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ScrollViewProps.onScroll | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ScrollViewProps.onRefresherPulling | ✔️ |  |  |  |  |  |
| ScrollViewProps.onRefresherRefresh | ✔️ |  |  |  |  |  |
| ScrollViewProps.onRefresherRestore | ✔️ |  |  |  |  |  |
| ScrollViewProps.onRefresherAbort | ✔️ |  |  |  |  |  |
| ScrollViewProps.onDragStart | ✔️ |  |  |  |  |  |
| ScrollViewProps.onDragging | ✔️ |  |  |  |  |  |
| ScrollViewProps.onDragEnd | ✔️ |  |  |  |  |  |

### onScrollDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| scrollLeft | `number` | 横向滚动条位置 |
| scrollTop | `number` | 竖向滚动条位置 |
| scrollHeight | `number` | 滚动条高度 |
| scrollWidth | `number` | 滚动条宽度 |
| deltaX | `number` |  |
| deltaY | `number` |  |
