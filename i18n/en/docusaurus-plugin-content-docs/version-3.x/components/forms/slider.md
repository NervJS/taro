---
title: Slider
sidebar_label: Slider
---

A slider picker.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/slider.html)

## Type

```tsx
ComponentType<SliderProps>
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
        <Text>sets step</Text>
        <Slider step={1} value={50}/>
        <Text>displays the current value</Text>
        <Slider step={1} value={50} showValue/>
        <Text>sets the minimum/maximum value</Text>
        <Slider step={1} value={100} showValue min={50} max={200}/>
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
    <text>sets step</text>
    <slider step="1" value="50"/>
    <text>displays the current value</text>
    <slider step="1" value="50" :show-value="true" />
    <text>sets the minimum/maximum value</text>
    <slider step="1" value="100" :show-value="true" min="50" max="200"/>
  </view>
</template>
```
  
</TabItem>
</Tabs>

## SliderProps

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
      <td>min</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The minimum value.</td>
    </tr>
    <tr>
      <td>max</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>100</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The maximum value.</td>
    </tr>
    <tr>
      <td>step</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>1</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The step. Its value must be greater than 0, and can be exactly divided by (max – min).</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to disable the component.</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The current value.</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;#e9e9e9&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The color of the background bar (Use backgroundColor).</td>
    </tr>
    <tr>
      <td>selectedColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;#1aad19&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The selected color (Use activeColor).</td>
    </tr>
    <tr>
      <td>activeColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;#1aad19&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The selected color.</td>
    </tr>
    <tr>
      <td>backgroundColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;#e9e9e9&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The color of the background bar.</td>
    </tr>
    <tr>
      <td>blockSize</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>28</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The size of the swiper. Its values range from 12 to 28.</td>
    </tr>
    <tr>
      <td>blockColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;#ffffff&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The color of the swiper.</td>
    </tr>
    <tr>
      <td>showValue</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to display the current value.</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The event triggered after the swiper is dragged.</td>
    </tr>
    <tr>
      <td>onChanging</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The event triggered during dragging of the swiper.</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| SliderProps.min | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.max | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.step | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.disabled | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.value | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.color | ✔️ |  |  | ✔️ |  |  |
| SliderProps.selectedColor | ✔️ |  |  | ✔️ |  |  |
| SliderProps.activeColor | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.backgroundColor | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.blockSize | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| SliderProps.blockColor | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.showValue | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.onChange | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.onChanging | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

### onChangeEventDetail

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Slider | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
