---
title: Icon
sidebar_label: Icon
---

Icon. The unit of length of the component's properties is px by default.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/icon.html)

## Type

```tsx
ComponentType<IconProps>
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
        <Icon size='60' type='success' />
        <Icon size='60' type='info' />
        <Icon size='60' type='warn' color='#ccc' />
        <Icon size='60' type='warn' />
        <Icon size='60' type='waiting' />
        <Icon size='20' type='success_no_circle' />
        <Icon size='20' type='warn' />
        <Icon size='20' type='success' />
        <Icon size='20' type='download' />
        <Icon size='20' type='clear' color='red' />
        <Icon size='20' type='search' />
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
    <icon size="60" type="success" />
    <icon size="60" type="info" />
    <icon size="60" type="warn" color="#ccc" />
    <icon size="60" type="warn" />
    <icon size="60" type="waiting" />
    <icon size="20" type="success_no_circle" />
    <icon size="20" type="warn" />
    <icon size="20" type="success" />
    <icon size="20" type="download" />
    <icon size="20" type="clear" color="red" />
    <icon size="20" type="search" />
  </view>
</template>
```
  
</TabItem>
</Tabs>


## IconProps

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
      <td>type</td>
      <td><code>&quot;success&quot; | &quot;success_no_circle&quot; | &quot;info&quot; | &quot;warn&quot; | &quot;waiting&quot; | &quot;cancel&quot; | &quot;download&quot; | &quot;search&quot; | &quot;clear&quot;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The type of the icon.</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>23</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The size of the icon.</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The color of the icon. It is the same as the color of the css.</td>
    </tr>
  </tbody>
</table>

### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| IconProps.type | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| IconProps.size | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| IconProps.color | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

### TIconType

Valid values of type

<table>
  <thead>
    <tr>
      <th>value</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>success</td>
      <td>success icon</td>
    </tr>
    <tr>
      <td>success_no_circle</td>
      <td>success icon(no circle)</td>
    </tr>
    <tr>
      <td>info</td>
      <td>info icon</td>
    </tr>
    <tr>
      <td>warn</td>
      <td>warn icon</td>
    </tr>
    <tr>
      <td>waiting</td>
      <td>waiting icon</td>
    </tr>
    <tr>
      <td>cancel</td>
      <td>cancel icon</td>
    </tr>
    <tr>
      <td>download</td>
      <td>download icon</td>
    </tr>
    <tr>
      <td>search</td>
      <td>search icon</td>
    </tr>
    <tr>
      <td>clear</td>
      <td>clear icon</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Icon | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
