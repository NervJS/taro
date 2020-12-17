---
title: matchMedia
sidebar_label: matchMedia
---


media query 匹配检测节点。可以指定一组 media query 规则，满足时，这个节点才会被展示。

通过这个节点可以实现“页面宽高在某个范围时才展示某个区域”这样的效果。


> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/match-media.html)

## 类型

```tsx
ComponentType<MatchMediaProps>
```

## 示例代码

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
class App extends Components {
  render () {
    return (
      <View>
        <MatchMedia min-width="300" max-width="600">
          <view>当页面宽度在 300 ~ 500 px 之间时展示这里</view>
        </MatchMedia>
        <MatchMedia min-height="400" orientation="landscape">
          <view>当页面高度不小于 400 px 且屏幕方向为纵向时展示这里</view>
        </MatchMedia>
      </View>
    )
  }
}
```
</TabItem>

<TabItem value="Vue">

```html
<template>
  <view class="components-page">
    <match-media min-width="300" max-width="500">
      <view>当页面宽度在 300 ~ 500 px 之间时展示这里</view>
    </match-media>
    <match-media min-height="400" orientation="landscape">
      <view>当页面高度不小于 400 px 且屏幕方向为纵向时展示这里</view>
    </match-media>
  </view>
</template>
```
  
</TabItem>
</Tabs>

## CoverImageProps

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style={{ textAlign: "center"}}>必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>minWidth</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>页面最小宽度（ px 为单位）</td>
    </tr>
    <tr>
      <td>maxWidth</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>页面最大宽度（ px 为单位）</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>页面宽度（ px 为单位）</td>
    </tr>
    <tr>
      <td>minHeight</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>页面最小高度（ px 为单位）</td>
    </tr>
    <tr>
      <td>maxHeight</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>页面最大高度（ px 为单位）</td>
    </tr>
    <tr>
      <td>Height</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>页面高度（ px 为单位）</td>
    </tr>
    <tr>
      <td>orientation</td>
      <td>string</td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>屏幕方向（ landscape 或 portrait ）</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CoverImageProps.src | ✔️ |  |  |
| CoverImageProps.onLoad | ✔️ |  |  |
| CoverImageProps.onError | ✔️ |  |  |


