---
title: MatchMedia
sidebar_label: MatchMedia
---


`media query` match detection node. You can specify a set of `media query` rules that will be satisfied before this node is displayed.

This node enables the effect that an area is only displayed when the page is within a certain width and height range.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/component/match-media.html)

## Type

```tsx
ComponentType<MatchMediaProps>
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
class App extends Components {
  render () {
    return (
      <View>
        <MatchMedia minWidth="300" maxWidth="600">
          <view>Displayed when the page width is between 300 ~ 500 px</view>
        </MatchMedia>
        <MatchMedia minHeight="400" orientation="landscape">
          <view>Displayed here when the page height is not less than 400 px and the screen orientation is portrait</view>
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
      <view>Displayed when the page width is between 300 ~ 500 px</view>
    </match-media>
    <match-media min-height="400" orientation="landscape">
      <view>Displayed here when the page height is not less than 400 px and the screen orientation is portrait</view>
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
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>minWidth</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specify the display condition for the minimum page width in px</td>
    </tr>
    <tr>
      <td>maxWidth</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specify the display condition for the maximum page width in px</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specify the display condition for the page width in px</td>
    </tr>
    <tr>
      <td>minHeight</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specify the display condition for the minimum page height in px</td>
    </tr>
    <tr>
      <td>maxHeight</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specify the display condition for the maximum page height in px</td>
    </tr>
    <tr>
      <td>Height</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specify the display condition for the page height in px</td>
    </tr>
    <tr>
      <td>orientation</td>
      <td>string</td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specify the display condition for the screen orientation</td>
    </tr>
  </tbody>
</table>

### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CoverImageProps.src | ✔️ |  |  |
| CoverImageProps.onLoad | ✔️ |  |  |
| CoverImageProps.onError | ✔️ |  |  |


