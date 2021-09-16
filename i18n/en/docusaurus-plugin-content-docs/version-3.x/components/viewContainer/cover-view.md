---
title: CoverView
sidebar_label: CoverView
---

Text view above native components. Native components that can be covered include map, video, canvas, camera, live-player, and live-pusher. Only cover-view and cover-image can be nested, and button can be used in cover-view. 

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/cover-view.html)

## Type

```tsx
ComponentType<CoverViewProps>
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
// js
class App extends Components {
  render () {
    return (
      <View className='container'>
        <Video id='myVideo' src='src'>
          <CoverView className='controls'>
            <CoverView className='play' onClick='play'>
              <CoverImage className='img' src='src' />
            </CoverView>
          </CoverView>
        </Video>
      </View>
    )
  }
}
// css
.container {
  position: relative;
}
.controls {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 225px;
  transform: translate(-50%, -50%);
}
```

</TabItem>

<TabItem value="Vue">

```html
<template>
  <view class="container">
    <video id='myvideo' src='https://ugccsy.qq.com/uwMROfz2r5zBIaQXGdGnC2dfDma3J1MItM3912IN4IRQvkRM/o31507f7lcd.mp4?sdtfrom=v1010&guid=aa18cf106b7fdb7e40f2d20b206f2b4f&vkey=63B0FCCC7FC3ADC342C166D86571AE02772258CD9B515B065DC68DF3919D8C288AE831D570ED5E8FE0FF3E81E170D04FF11F874BFDDACF7AAA2C0CFF2ACB39FB1A94DAD1AB859BDA53E4DD6DBCDC1217CEF789A9AC079924E2BBC599EED7A1FFDD60A727F2EB7E7B6472CE63DD4B683C9199DFC78A6A6C4D9891E05467C4B64E'>
    </video>
    <cover-view class='controls'>
      <cover-view class='play' @tap='play'>
        <cover-image class='img' src='https://img10.360buyimg.com/ling/s345x208_jfs/t1/133501/7/9865/382161/5f5ee31fEbdd6a418/0cdc0156ffff3c23.png' />
      </cover-view>
    </cover-view>
  </view>
</template>

<style>
.container {
  position: relative;
}
.controls {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 225px;
  transform: translate(-50%, -50%);
}
</style>

```
  
</TabItem>
</Tabs>

## CoverViewProps

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>scrollTop</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Sets the top offset of the scroll bar. It takes effect only when overflow-y: scroll is set to become a scrolling element.</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CoverViewProps.scrollTop | ✔️ |  |  |

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| CoverView | ✔️ | ✔️ | ✔️ |  |  |
