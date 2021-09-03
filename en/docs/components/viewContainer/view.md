---
title: View
sidebar_label: View
---

View container.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/component/view.html)

## Type

```tsx
ComponentType<ViewProps>
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

export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <View className='components-page'>
        <Text>flex-direction: row</Text>
        <View className='flex-wrp' style='flex-direction:row;'>
          <View className='flex-item demo-text-1'/>
          <View className='flex-item demo-text-2'/>
          <View className='flex-item demo-text-3'/>
        </View>
        <Text>flex-direction: column</Text>
        <View className='flex-wrp' style='flex-direction:column;'>
          <View className='flex-item flex-item-V demo-text-1'/>
          <View className='flex-item flex-item-V demo-text-2'/>
          <View className='flex-item flex-item-V demo-text-3'/>
        </View>
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
    <text>flex-direction: row</text>
    <view class="flex-wrp flex-wrp-row" hover-class="hover" >
      <view class="flex-item demo-text-1" :hover-stop-propagation="true" />
      <view class="flex-item demo-text-2" hover-start-time="1000" hover-class="hover" />
      <view class="flex-item demo-text-3" hover-stayTime="1000" hover-class="hover" />
    </view>
    <text>flex-direction: column</text>
    <view class="flex-wrp flex-wrp-column">
      <view class="flex-item flex-item-V demo-text-1" />
      <view class="flex-item flex-item-V demo-text-2" />
      <view class="flex-item flex-item-V demo-text-3" />
    </view>
  </view>
</template>

<style>
.flex-wrp { display: flex; }
.flex-wrp-column{ flex-direction: column; }
.flex-wrp-row { flex-direction:row; padding: 20px; background: #f1f1f1; }
.flex-item { width: 180px; height: 90px; }
.demo-text-1 { background: #ccc; }
.demo-text-2 { background: #999; }
.demo-text-3 { background: #666; }
.hover {
  background: #000;
}
</style>
```

</TabItem>
</Tabs>

## ViewProps

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
      <td>hoverClass</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>none</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>The style class of the button that is tapped.When <code>hover-class=&quot;none&quot;</code> , the tap state is not displayed.</td>
    </tr>
    <tr>
      <td>hoverStyle</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>none</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>Since RN does not support Class, the View component on the RN side implements the <code>hoverStyle</code>property. <code>hoverStyle</code> is written similarly to style, except that it specifies the style to be pressed.</td>
    </tr>
    <tr>
      <td>hoverStopPropagation</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>fasle</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>Specifies whether to block the tapped state from the ancestor node of this node.</td>
    </tr>
    <tr>
      <td>hoverStartTime</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>50</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>按住后多久出现点击态，单位毫秒</td>
    </tr>
    <tr>
      <td>hoverStayTime</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>400</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>手指松开后点击态保留时间，单位毫秒</td>
    </tr>
    <tr>
      <td>catchMove</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>Block scrolling events from penetrating.</td>
    </tr>
  </tbody>
</table>

### Property Support

|              API               | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 |                                          React Native                                           |
|:------------------------------:|:-------------------:|:-------------------:|:-------------------:|:-------------------:|:--:|:-----------------------------------------------------------------------------------------------:|
|      ViewProps.hoverClass      |         ✔️          |         ✔️          |         ✔️          |         ✔️          | ✔️ | (由于 RN 不支持 Class，故 RN 端的 View 组件实现了 `hoverStyle`属性，写法和 style 类似，只不过 `hoverStyle` 的样式是指定按下去的样式。) |
|      ViewProps.hoverStyle      |                     |                     |                     |                     |    |                                               ✔️                                                |
| ViewProps.hoverStopPropagation |         ✔️          |         ✔️          |         ✔️          |         ✔️          |    |                                                                                                 |
|    ViewProps.hoverStartTime    |         ✔️          |         ✔️          |         ✔️          |         ✔️          | ✔️ |                                               ✔️                                                |
|    ViewProps.hoverStayTime     |         ✔️          |         ✔️          |         ✔️          |         ✔️          | ✔️ |                                               ✔️                                                |

## API Support

| API  | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
|:----:|:-------------------:|:-------------------:|:-------------------:|:-------------------:|:--:|:------------:|
| View |         ✔️          |         ✔️          |         ✔️          |         ✔️          | ✔️ |      ✔️      |
