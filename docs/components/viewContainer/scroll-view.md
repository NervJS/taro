---
title: ScrollView
sidebar_label: ScrollView
---

##### 可滚动视图区域
> 属性

| 属性名 | 类型 | 默认值 | 说明 |
| :- | :- | :- | :- |
| scrollX              | Boolean     | false  | 允许横向滚动 |
| scrollY              | Boolean     | false  | 允许纵向滚动 |
| upperThreshold       | Number      | 50     | 距顶部/左边多远时（单位 px），触发 scrolltoupper 事件  |
| lowerThreshold       | Number      | 50     | 距底部/右边多远时（单位 px），触发 scrolltolower 事件  |
| scrollTop            | Number      |        | 设置竖向滚动条位置 |
| scrollLeft           | Number      |        | 设置横向滚动条位置 |
| scrollIntoView      | String      |        | 值应为某子元素 id（id 不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素 |
| scrollWithAnimation | Boolean     | false  | 在设置滚动条位置时使用动画过渡  |
| enableBackToTop    | Boolean     | false  | iOS 点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向                     |
| onScrollToUpper     | EventHandle |        | 滚动到顶部/左边，会触发 scrolltoupper 事件 |
| onScrollToLower     | EventHandle |        | 滚动到底部/右边，会触发 scrolltolower 事件 |
| onScroll            | EventHandle |        | 滚动时触发，event.detail = {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY} |

>各端支持度

| 属性 | 微信小程序 | H5 | ReactNative | 百度小程序 | 支付宝小程序 | 字节跳动小程序 |
| :-: | :-: | :-: | :- | :- | :- | :- |
| scrollX     | ✔ | ✔ |  X (二选一)| ✔ | ✔ | ✔ |       
| scrollY            | ✔ | ✔ |  X (二选一)| ✔ | ✔ | ✔ |
| upperThreshold     | ✔ | ✔ |  ✔ | ✔ | ✔ | ✔ |
| lowerThreshold     | ✔ | ✔ |  ✔| ✔ | ✔ | ✔ |
| scrollTop          | ✔ | ✔ |  ✔| ✔ | ✔ | ✔ |
| scrollLeft         | ✔ | ✔ |  ✔| ✔ | ✔ | ✔ |
| scrollIntoView     | ✔ | ✔ |  | ✔ | ✔ | ✔ |
| scrollWithAnimation| ✔ | ✔ |  ✔| ✔ | ✔ | ✔ |
| enableBackToTop    | ✔ |  |  ✔|  | ✔ |  |
| onScrollToUpper    | ✔ | ✔ |  ✔| ✔ | ✔ | ✔ |
| onScrollToLower    | ✔ | ✔ |  ✔| ✔ | ✔ | ✔ |
| onScroll  | ✔ | ✔ |  ✔| ✔ | ✔ | ✔ |

使用竖向滚动时，需要给 `<scroll-view/>` 一个固定高度，通过 WXSS 设置 height。

###### 示例：
```jsx
import Taro, { Component } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'

export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    const scrollStyle = {
      height: '150px'
    }
    const scrollTop = 0
    const Threshold = 20
    const vStyleA = {
      height: '150px',
      'background-color': rgb(26, 173, 25)
    }
    const vStyleB = {
       height: '150px',
      'background-color': rgb(39,130,215)
    }
    const vStyleC = {
      height: '150px',
      'background-color': rgb(241,241,241),
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
            onScrolltoupper={this.onScrolltoupper}
            onScroll={this.onScroll}>
            <View style={vStyleA}>A</View>
            <View style={vStyleB}>B</View>
            <View style={vStyleC}>C</View>
          </ScrollView>
    )
  }
}
```

###### Tips:
* H5 中 ScrollView 组件是通过一个高度（或宽度）固定的容器内部滚动来实现的，因此务必正确的设置容器的高度。例如: 如果 ScrollView 的高度将 body 撑开，就会同时存在两个滚动条（body 下的滚动条，以及 ScrollView 的滚动条）。
* 微信小程序 中 ScrollView 组件如果设置 scrollX 横向滚动时，并且子元素为多个时（单个子元素时设置固定宽度则可以正常横向滚动），需要通过 WXSS 设置 white-space 为 nowrap 来保证元素不换行，并对 ScrollView 内部元素设置 display 为 inline-block 来使其能够横向滚动。
