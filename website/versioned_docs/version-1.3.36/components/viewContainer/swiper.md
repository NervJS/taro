---
title: Swiper
sidebar_label: Swiper
id: version-1.3.36-swiper
original_id: swiper
---

##### 滑块视图容器

> 属性

| 属性名 | 类型 | 默认值 | 说明 |
| :- | :- | :- | :- |
|indicatorDots           | Boolean     | false             | 是否显示面板指示点                                           |
|indicatorColor          | String      | rgba(0, 0, 0, .3) | 指示点颜色                                                   |
|indicatorActiveColor    | String      | 000               | 当前选中的指示点颜色                                         |
|autoplay                | Boolean     | false             | 是否自动切换                                                 |
|interval                | Number      | 5000              | 自动切换时间间隔                                             |
|duration                | Number      | 500               | 滑动动画时长                                                 |
|current                 | Number      | 0                 | 当前所在滑块的 index                                         |
|onChange                | EventHandle |                   | current 改变时会触发 change 事件                             |
|circular                | Boolean     | false             | 是否采用衔接滑动                                             |
|skipHiddenItemLayout    | Boolean     | false             | 是否跳过未显示的滑块布局，设为 true 可优化复杂情况下的滑动性能，但会丢失隐藏状态滑块的布局信息 |
|displayMultipleItems    | Number      | 1                 | 同时显示的滑块数量                                           |
|vertical                | Boolean     | false             | 滑动方向是否为纵向                                           |
|onAnimationFinish       | EventHandle |                   | 动画结束时会触发 animationfinish 事件                        |

>各端支持度

| 属性 | 微信小程序 | H5 | ReactNative | 百度小程序 | 支付宝小程序 | 字节跳动小程序 |
| :-: | :-: | :-: | :- | :- | :- | :- |
|indicatorDots           | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
|indicatorColor          | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
|indicatorActiveColor    | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
|autoplay                | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
|interval                | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
|duration                | ✔ | ✔ | x | ✔ | ✔ | ✔ |
|current                 | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
|onChange                | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
|circular                | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
|skipHiddenItemLayout    | ✔ |    | x | ✔ |  |  |
|displayMultipleItems    | ✔ |    | x | ✔ |  | ✔ |
|vertical                | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
|onAnimationFinish       | ✔ | ✔ | ✔ | ✔ |  |  |

###### 示例：
```jsx
import Taro, { Component } from '@tarojs/taro'
// 引入 Swiper, SwiperItem 组件
import { Swiper, SwiperItem, View } from '@tarojs/components'

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
