---
title: Switch
sidebar_label: Switch
---

Switch picker.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/switch.html)

## Type

```tsx
ComponentType<SwitchProps>
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
        <Text>default style</Text>
        <Switch checked/>
        <Switch/>
        <Text>recommend style</Text>
        <Switch checked/>
        <Switch/>
      </View>
    )
  }
}
```
</TabItem>

<TabItem value="Vue">

```html
<template>
  <view class='components-page'>
    <text>default style</text>
    <switch :checked="true" />
    <switch />
    <text>recommend style</text>
    <switch :checked="true" />
    <switch />
  </view>
</template>
```
  
</TabItem>
</Tabs>


## SwitchProps

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
      <td>checked</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether the item is selected</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to disable the component.</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>&quot;switch&quot; | &quot;checkbox&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;switch&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The style. Valid values include `switch` and `checkbox`.</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;#04BE02&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The color of the switch component. It is the same as the color of the css component.</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>A change event triggered when checked changes.</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| SwitchProps.checked | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwitchProps.disabled | ✔️ |  |  |  |  |  |
| SwitchProps.type | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwitchProps.color | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwitchProps.onChange | ✔️ |  |  |  |  |  |

### onChangeEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>boolean</code></td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Switch | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
